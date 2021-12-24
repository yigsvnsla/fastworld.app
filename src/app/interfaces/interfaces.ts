

    export interface Vehicle {
        id: number;
        type?: any;
        enroller?: any;
        maker?: any;
        model?: any;
        year?: any;
        color?: any;
    }

    export interface Thumbnail {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path?: any;
        size: number;
        width: number;
        height: number;
    }

    export interface Formats {
        thumbnail: Thumbnail;
    }

    export interface DniPhoto {
        id: number;
        name: string;
        alternativeText?: any;
        caption?: any;
        width: number;
        height: number;
        formats: Formats;
        hash: string;
        ext: string;
        mime: string;
        size: number;
        url: string;
        previewUrl?: any;
        provider: string;
        provider_metadata?: any;
        created_at: Date;
        updated_at: Date;
    }

    export interface Document {
        id: number;
        client: number;
        dni: string;
        city: string;
        address: string;
        created_at: Date;
        updated_at: Date;
        vehicle: Vehicle;
        dni_photo: DniPhoto;
        license_driver?: any;
    }

    export interface Membership {
        id: number;
        type: string;
        start:string
        end: string;
    }

    export interface User {
        name: string;
        lastname: string;
        phone: string;
        status: string;
        role: string;
        email: string;
        birthday?: any;
        document: Document;
        membership: Membership;
    }

    export interface Auth {
        email?: string,
        jwt?: string,
        status?:string,
        message?: string
      }

      export interface Products {
        id?:          number;
        type?:        string;
        price?:       number;
        user_name?:   string;
        user_phone?:  string;
        status?:      string;
        driver?:      Client;
        client?:      Client;
        location?:    ProductsLocation;
        created_at?:  Date;
        updated_at?:  Date;
        timeout?:     Date;
        price_route?: number;
    }
    
    export interface Client {
        id?:       number;
        name?:     string;
        lastname?: string;
        email?:    string;
        phone?:    string;
    }
    
    export interface ProductsLocation {
        goal?:  Ubication;
        start?: Ubication;
    }
    
    export interface Ubication {
        address?:   string;
        location?:  Position | google.maps.LatLng | google.maps.LatLngLiteral;
        indications?: string;
    }

    export interface Position {
        lat?: number;
        lng?: number;
        accuracy?:string
    }
    