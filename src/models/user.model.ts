import { ApiProperty } from "@nestjs/swagger";

export class UserData {
    @ApiProperty({ example: "1234", description: "The unique identifier of the user", type: String })
    id: string;

    @ApiProperty({ example: "2021-01-01T00:00:00.000Z", description: "The date and time when the user was created", type: String })
    created_at: string;

    @ApiProperty({ example: "johndoe@mail.com", description: "User email", type: String })
    email: string;

    @ApiProperty({ example: "John", description: "User first name", type: String })
    first_name: string;

    @ApiProperty({ example: "Doe", description: "User last name", type: String })
    last_name: string;

    @ApiProperty({ example: "1234", description: "User latitude", type: String })
    latitute: string;

    @ApiProperty({ example: "1234", description: "User longitude", type: String })
    longitude: string;

    @ApiProperty({ example: "Ljubljana", description: "User location", type: String })
    location: string;
}

