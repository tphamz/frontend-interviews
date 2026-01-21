CREATE table Users(
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)


CREATE table Workspaces(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT
)

CREATE table projects(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    workspace_id BIGINT REFERENCES workspaces(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT FALSE
)

CREATE table Tasks(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    state VARCHAR(255),
    assignee_id BIGINT REFERENCES Users(id) ON DELETE SET NULL
)

CREATE table Project_Tasks(
    project_id BIGINT REFERENCES Projects(id) ON DELETE CASCADE,
    task_id BIGINT REFERENCES Tasks(id) ON DELETE CASCADE,
    sort_order DECIMAL NOT NULL,
    PRIMARY KEY (project_id, task_id),
    CONSTRAINT project_task_order UNIQUE (project_id, sort_order)
)

CREATE table workspace_members(
    workspace_id BIGINT REFERENCES Workspaces(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES Users(id) ON DELETE CASCADE,
    user_role VARCHAR(255),
    PRIMARY KEY (workspace_id, user_id)

)

CREATE table project_members(
    user_id BIGINT REFERENCES Users(id) ON DELETE CASCADE,
    project_id BIGINT REFERENCES Projects(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, project_id)
)

CREATE table task_followers(
    follower_id BIGINT REFERENCES Users(id) ON DELETE CASCADE,
    task_id BIGINT REFERENCES Tasks(id) ON DELETE CASCADE,
    PRIMARY KEY (follower_id, task_id)
)



----------------------------------------------------------------
Create a workspace:
POST: /workspaces
body: { name: <string>, description: <string> }
const client = await pool.connect();
try{
    await client.query('BEGIN');
    const result = await client.query(`
        INSERT into workspaces (name, description)
        VALUES ($1, $2)
        RETURNING id;
    `, [name, description]);

    const workspaceId = result.rows[0].id;
    await client.query(`
        INSERT into workspace_members (workspace_id, user_id, user_role)
        VALUES ($1, $2, 'ADMIN')
    `, [result.rows[0].id, currentUser.id]);
    await client.query('COMMIT');
    return {id: workspaceId};
}catch(err){
    await client.query('ROLLBACK');
    console.log(err);
}finally{
    await client.release();
}

-----------------------------------------------------------------------
GET /projects/:pid/tasks
params: pid - path param, limit - query param, last_sort_order - query param
try{
    const client = await pool.connect();
    const result = await client.query(`
        SELECT 
            t.id as id,
            t.name as name,
            t.description as description,
            t.state as state,
            pt.sort_order as sort_order,
            u.full_name as full_name,
            u.email as email
        FROM
            tasks t JOIN project_tasks pt ON t.id = pt.task_id 
            JOIN projects p ON p.id = pt.project_id
            LEFT JOIN users u ON t.assignee_id = u.id
            LEFT JOIN project_members pm ON pm.project_id = pt.project_id AND pm.user_id = $4
        WHERE 
            ($3::decimal is NULL OR pt.sort_order> $3) AND (p.is_public = TRUE OR pm.user_id = $4) AND pt.project_id = $1
        ORDER BY
            pt.sort_order
        LIMIT $2
    `, [pid, limit, last_sort_order, currentUser.id])
}catch(err){
    console.error(err.message);
}finally{
    client.release();
}

------------------------------------------------------------------
create project
POST:/workspaces/{w_id}/projects
params: w_id
body: {name, description}
let ans = null;
try{
    const client = await pool.connect();
    await client.query("BEGIN");
    const res = await client.query(`
        INSERT INTO projects (name, description, workspace_id)
        SELECT $1, $2, $3
        WHERE EXISTS(
            SELECT 1 FROM workspace_members wp WHERE wp.workspace_id=$3 AND wp.user_id = $4 AND wp.user_role='ADMIN'
        )
        RETURNING id
    `, [name, description, w_id, currentUser.id]);
    if(res.rowCount===0) throw new Error("No workspace found or user does not have the required permission");
    await client.query(`
        INSERT INTO project_members (project_id, user_id)
        VALUES ($1, $2)
    `, [res.rows[0].id, currentUser.id]);
    await client.query("COMMIT");
    ans = {id: res.rows[0].id};
}catch(err){
    await client.query("ROLLBACK");
    console.error(err.message);
    ans = {error_message: err.message};
}finally{
    await client.release();
}
return ans;

--------------------------------------------
create task
POST:/tasks
body {name, description}

let ans = null;
const client = await pool.connect();
try{
    await client.query("BEGIN");
    const res = await client.query(`
        INSERT INTO tasks (name, description)
        VALUES ($1, $2)
        RETURNING id
    `, [name, description]);
    await client.query(`
        INSERT INTO task_followers (task_id, follower_id)
        VALUES ($1, $2)
    `,[res.rows[0].id, currentUser.id]);
    ans  = {id: res.rows[0].id}
    await client.query("COMMIT");
}catch(err){
    await client.query("ROLLBACK");
    console.error(err.message);
    ans = {error_message: err.message};
}finally{
   await client.release();
}
return ans;
--------------------------------------------------
add tasks to project
POST:/projects/{pid}/add_tasks
body: {task_ids: []string}
const client = await pool.connect();
try{
    await client.query("BEGIN");
    const res = await client.query(`
        WITH anchor AS(
            SELECT COALESCE(MAX(pt.sort_order), 0) as sort_order
            FROM project_tasks pt 
            WHERE pt.project_id = $1
        )

        INSERT INTO project_tasks (project_id, task_id, sort_order)
        SELECT $1, t_id, anchor.sort_order + ((ROW_NUMBER() OVER()) * 10000.0)
        FROM unnest($2::bigInt[]) as t_id
        CROSS JOIN anchor
        JOIN project_members pm
        ON pm.project_id = $1 AND pm.user_id=$3
        ON CONFLICT (project_id, task_id) DO NOTHING
    `, [pid, task_ids, currentUser.id]);
    await client.query("COMMIT");
}catch(err){    
    await client.query("ROLLBACK");
    console.error(err.message);
}finally{
    await client.release();
}

-----------------------------------------------------
move tasks
POST: /projects/{pid}/tasks/{id}/move
body {prev_id, next_id}

const moveTask = async (pid, id, prev_id, next_id)=>{
    const client = await pool.connect();
    let res = null;
    try{
        await client.query("BEGIN");
        const result = await client.query(`
            WITH boundaries AS (
                SELECT MAX( CASE WHEN pt.task_id = $3 THEN pt.sort_order END) as lower_bound,
                    MAX (CASE WHEN pt.task_id = $4 THEN pt.sort_order END) as upper_bound
                FROM project_tasks pt
                WHERE pt.project_id =  $1
            )
            UPDATE project_tasks pt
            SET pt.sort_order = (
                SELECT CASE WHEN b.lower_bound IS NULL THEN (b.upper_bound/2.0)
                            WHEN b.upper_bound IS NULL THEN (b.lower_bound + 10000.0)
                            ELSE ((b.lower_bound + b.upper_bound)/2.0)
                            END
                FROM boundaries b
            ) 
            WHERE pt.project_id = $1 AND task_id = $2
            AND EXISTS (
                SELECT 1 FROM projects p LEFT JOIN project_members pm ON p.id = pm.project_id
                WHERE p.id = $1 AND (p.is_public = TRUE OR pm.user_id = $5)
            )
        `, [pid, id, prev_id, next_id, currentUser.id]);
        await client.query("COMMIT");
        res = {id};
    }catch(err){
        await client.query("ROLLBACK")
        if(err.code ==="23505"){
            //rebalance
            await client.query(`
                WITH rebalance_list AS(
                    SELECT pt.task_id as task_id, (ROW_NUMBER() OVER(ORDER BY sort_order)*10000.0) as new_sort_order
                    FROM project_tasks pt
                    WHERE pt.project_id = $1
                )

                UPDATE project_tasks pt
                SET sort_order = rl.new_sort_order
                FROM rebalance_list rl
                WHERE project_id = $1 AND pt.task_id = rl.task_id
            `, [pid]);
            res = await moveTask(pid, id, prev_id, next_id);
        }
        else res = {message: err.message};
    }finally{
        await client.release();
    }
    return res;
}
