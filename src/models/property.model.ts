import { ApiProperty } from "@nestjs/swagger";

export class Property {
    @ApiProperty({ example: "1234", description: "The unique identifier of the property", type: String })
    id: string;

    @ApiProperty({ example: "1234", description: "The unique identifier of the user", type: String })
    user_id: string;

    @ApiProperty({ example: "2021-01-01T00:00:00.000Z", description: "The date and time when the property was created", type: String })
    created_at: string;

    @ApiProperty({ example: "House 1", description: "Property name", type: String })
    name: string;

    @ApiProperty({ example: "This is a beautiful house", description: "Property description", type: String })
    description: string;

    @ApiProperty({ example: 100000, description: "Property price", type: Number })
    price: number;

    @ApiProperty({ example: 100, description: "Property size", type: Number })
    size: number;

    @ApiProperty({ example: "1234", description: "Property latitude", type: String })
    latitute: string;

    @ApiProperty({ example: "1234", description: "Property longitude", type: String })
    longitude: string;

    @ApiProperty({ example: "https://example.com/image.jpg", description: "Property image URL", type: String })
    image: string;

    @ApiProperty({ example: "Ljubljana", description: "Property location", type: String })
    location: string;

    @ApiProperty({ example: "appartment", description: "Property type", type: String })
    type: PropertyType;
}

//appartment, house, garage, plot, business_premises
export enum PropertyType {
    APPARTMENT = "appartment",
    HOUSE = "house",
    GARAGE = "garage",
    PLOT = "plot",
    BUSINESS_PREMISES = "business_premises",
}