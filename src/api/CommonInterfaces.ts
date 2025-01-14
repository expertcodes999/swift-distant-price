// CommonInterfaces.ts
  
interface Venueraw {
    id: string;
    favourite: boolean;
    preestimate_total: Preestimatetotal;
    preestimate_preparation: Preestimatetotal;
    alive: boolean;
    applepay_callback_flow_enabled: boolean;
    googlepay_callback_flow_enabled: boolean;
    discounts: any[];
    surcharges: any[];
    delivery_specs: Deliveryspecs;
    self_delivery: boolean;
    payment_method_restrictions?: any;
    discounts_restrictions_text: string;
    preorder_specs: Preorderspecs;
    group_order_id: string;
  }

  interface Venueraw {
    id: string;
    name: string;
    image_url: string;
    image_blurhash: string;
    brand_logo_image_url?: any;
    brand_logo_image_blurhash?: any;
    description: string;
    group_order_enabled: boolean;
    share_url: string;
    delivery_methods: string[];
    currency: string;
    opening_times: Openingtimes;
    preorder_specs: Preorderspecs;
    ncd_allowed: boolean;
    tipping: Tipping;
    delivery_note?: any;
    public_visible: boolean;
    bag_fee?: any;
    comment_disabled: boolean;
    short_description?: any;
    city_id: string;
    merchant: string;
    show_allergy_disclaimer_on_menu: boolean;
    price_range: number;
    item_cards_enabled: boolean;
    service_fee_description: string;
    food_tags?: any;
    allowed_payment_methods: string[];
    food_safety_reports?: any;
    is_wolt_plus: boolean;
    categories?: any;
    rating?: any;
    location: Location;
    string_overrides: Stringoverrides;
  }

  export  interface Stringoverrides {
    weighted_items_popup_disclaimer?: any;
    restricted_item_bottom_sheet_title: string;
    restricted_item_bottom_sheet_info: string;
    restricted_item_bottom_sheet_confirm: string;
  }
  
 export interface Deliveryspecs {
    delivery_enabled: boolean;
    order_minimum_no_surcharge: number;
    order_minimum_possible: number;
    delivery_times: Deliverytimes;
    original_delivery_price: number;
    delivery_pricing: Deliverypricing;
    delivery_pricing_with_subscription?: any;
    delivery_pricing_without_subscription?: any;
    geo_range: Georange;
  }


export interface RootObject {
    venue: Venue;
    venue_raw: Venueraw;
    order_minimum?: number; // Optional since not all responses have this field
}


export interface Location {
    bbox?: any;
    type: string;
    coordinates: number[];
}

export interface Tipping {
    currency: string;
    tip_amounts: number[];
}

export interface Preorderspecs {
    preorder_only: boolean;
    time_step: number;
}

export interface Openingtimes {
    monday: Monday[];
}

export interface Monday {
    type: string;
    value: number;
}

export interface Venue {
    id: string;
    name: string;
    description: string;
}

  
  interface Orderstatus {
    value: string;
  }

  

  
  interface Homedeliveryspec {
    earliest_timedelta: number;
    latest_timedelta: number;
    preorder_times: Deliverytimes;
  }
  

  
  interface Georange {
    bbox?: any;
    type: string;
    coordinates: number[][][];
  }
  
  interface Deliverypricing {
    base_price: number;
    price_ranges: Pricerange[];
    distance_ranges: Distancerange[];
    meta: Meta;
  }
  
  interface Meta {
    subscription_minimum_basket?: any;
    subscription_max_distance?: any;
    subscription_plan_id?: any;
  }
  
  interface Distancerange {
    min: number;
    max: number;
    a: number;
    b: number;
    flag?: any;
  }
  
  interface Pricerange {
    min: number;
    max: number;
    a: number;
    b: number;
    flag?: any;
    custom_distance_ranges?: any;
  }
  
  interface Deliverytimes {
    monday: Monday[];
    tuesday?: any;
    wednesday?: any;
    thursday?: any;
    friday?: any;
    saturday?: any;
    sunday: Monday[];
  }

  
  interface Preestimatetotal {
    min: number;
    max: number;
    mean: number;
  }
  


  
 
 
  
  