-- The 'User' is the global identity
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL, -- The primary login ID
    
    -- Optional for Staff, but required for Owners/Managers
    email VARCHAR(255) UNIQUE, 
    
    -- Password for web login, but they might use PIN on the tablet
    password_hash TEXT, 
    
    is_verified BOOLEAN DEFAULT FALSE, -- For SMS verification
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- The 'Membership' connects the person to the shop
CREATE TABLE user_business_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- The Human (Global)
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    
    -- The Shop (Specific)
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE RESTRICT,
    
    -- Role & Permissions
    -- Roles: 'owner', 'manager', 'cashier', 'stylist', 'waiter'
    role VARCHAR(50) NOT NULL,
    
    -- Station Security
    -- Using terminal_pin for fast tablet switching (phone number + pin)
    terminal_pin VARCHAR(10), 
    
    -- Status & Compliance
    is_active BOOLEAN DEFAULT TRUE, -- Use this to "fire" or deactivate staff
    
    -- Soft Delete: Never actually DELETE from this table. 
    -- If a manager removes staff, set this timestamp.
    deleted_at TIMESTAMP WITH TIME ZONE, 
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    -- Prevents a user from having two active memberships at the same shop
    UNIQUE(user_id, business_id) 
);

CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blueprint_id UUID REFERENCES blueprints(id) ON DELETE RESTRICT,
    
    name VARCHAR(255) NOT NULL,
    handle VARCHAR(100) UNIQUE NOT NULL,  -- Unique URL or system handle
    tax_number VARCHAR(100),              -- EIN, VAT, etc.
    currency VARCHAR(3) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    status VARCHAR(20) DEFAULT 'active',  -- 'active', 'suspended', 'onboarding'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_business_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- The role this specific user has at this specific business
    -- e.g., 'owner', 'manager', 'cashier'
    role VARCHAR(50) NOT NULL,
    
    -- Optional: unique PIN for this specific business
    -- (Staff might use different PINs at different locations)
    pin_code VARCHAR(10), 
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensures a user isn't added to the same business twice
    UNIQUE(user_id, business_id)
);

CREATE TABLE blueprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,            -- e.g., 'Hospitality', 'Retail', 'Wellness'
    slug VARCHAR(50) UNIQUE NOT NULL,     -- e.g., 'restaurant-standard'
    version INT DEFAULT 1,                -- Incremental versioning
    
    -- Defines the UI layout (e.g., sidebar links, dashboard widgets)
    ui_schema JSONB NOT NULL,             
    
    -- Available features for this industry (e.g., {"inventory": true})
    module_definitions JSONB NOT NULL,    
    
    -- Hard constraints (e.g., {"requires_table_number": true})
    logic_rules JSONB NOT NULL,           
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE business_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- Branding: logo_url, brand_colors, receipt_footer_text
    brand_settings JSONB DEFAULT '{}',     
    
    -- Enabled modules for this specific shop: ["tables", "loyalty"]
    active_modules JSONB DEFAULT '[]',     
    
    -- The "Meat": Floor maps, room IDs, or service categories
    industry_data JSONB DEFAULT '{}',      
    
    -- Device settings: printer IPs, card reader IDs
    hardware_map JSONB DEFAULT '{}',       
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0, -- To control the order on the POS screen
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),            -- Barcode/Stock Keeping Unit
    base_price DECIMAL(12, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) DEFAULT 0.00,
    
    -- Blueprint-specific data
    -- Restaurant: {"is_kitchen_item": true, "printer_tag": "grill"}
    -- Salon: {"duration_minutes": 60, "requires_staff": true}
    product_metadata JSONB DEFAULT '{}',
    
    is_active BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT 0, -- For physical goods
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);