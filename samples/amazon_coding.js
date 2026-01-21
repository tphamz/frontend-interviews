/*
You have a list of the last five products that a customer ordered from your shopping Website. You want to show ads to the customer based on certain attributes 
of their purchases, such as the price range or the department.

You need to implement an evaluation function that receives that list of products and returns the best matching category.
To start off, let's say that the following are the categories to identify, from better to worse:

Assume there is already a data structure like this one:

public class OrderedProduct {
    private String priceRange; // it's the price range of the product when it was bought. For example: “$50 to $100”
    private String department; // it's the department on which the product was bought. For example: “Automotive”
    ...
}

1. If there are five products with the same priceRange, return "SamePriceRange" or any suitable value.
2. If there are 6 or more products with the same department, return "StrongCommonDepartment" or any suitable value.
3. If there are two products with the same department, return "CommonDepartment" or any suitable value.
--------------------------------------------------------------------------------------------------------------------------------------------------------
*/
class EvaluateProducts{
    #products;
    #conditions;
    #priceMatches;
    #departmentMatches;
    #conditions;
    constructor(products, conditions){
        this.#conditions = conditions;
        this.#products = products;
        this.#priceMatches = new Map();
        this.#departmentMatches = new Map();

    for(let {price, department} of products){
        this.#priceMatches.set(price, this.#currentPriceMatch);
        this.#departmentMatches.set(department, currentDepartmentMatch);
    }
}
    evaluate(){
        
    }
    
    #compare(){
        
    }
}

function evaludateProducts(products, conditions){
    //{price, department}
    const priceMatches = new Map();
    const departmentMatches = new Map();
    let isSamePriceRange = false, isCommonDepartment = false;
    
    for(let {price, department} of products){
        priceMatches.set(price, currentPriceMatch);
        departmentMatches.set(department, currentDepartmentMatch);
    }
    
    try{
        for(let condition of conditions){
            const res = condition(priceMatches, departmentMatches);
            if(res) return res;
        }
    }catch(err){
        return "";    
    }
    
    return "";
}

const isSamePriceMatch = (priceMatches)=>{
    for(let value of priceMatches.values())
        if(value>=5) return "SamePriceRange";
    return false;
}


const isStrongCommonDepartment = (_, productMatches)=>{
    for(let value of productMatches.values()){
        if(value>=6) return "StrongCommonDepartment"
    }
    return false;
}


const isCommonDepartment = (_, productMatches)=>{
    for(let value of productMatches.values()){
        if(value>=2) return "CommonDepartment"
    }
    return false;
}
evaluateProducts(products, [isSamePriceMatch, isStrongCommonDepartment, isCommonDepartment]);
