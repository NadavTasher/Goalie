import { Utilities, Password, File, Validator } from "../internal/utilities.mjs";

// Initialize variables
const Issuer = new Authority(process.env.secret);
const Datastore = new File("datastore.json");

export default {
    authenticate: {
        handler: (parameters) => {
            // Make sure the password is correct
            if (!Password.validate(parameters.password, process.env.password))
                throw new Error("Password is incorrect");

            return Issuer.issue("Goalie access token");
        },
        parameters: {
            password: "string"
        }
    },
    fetch: {
        handler: (parameters) => {
            // Validate token
            Issuer.validate(parameters.token);

            // Read and return
            return Datastore.read({});
        },
        parameters: {
            // Authetnication parameters
            token: "string"
        }
    },
    update: {
        handler: (parameters) => {
            // Validate token
            Issuer.validate(parameters.token);

            // Read datastore
            let datastore = Datastore.read({});

            // Update day
            datastore[parameters.day.toString()] = parameters.status;

            // Write datastore
            Datastore.write(datastore);

            // Return success
            return true;
        },
        parameters: {
            // Authentication parameters
            token: "string",
            // Application parameters
            day: "number",
            status: "boolean"
        }
    }
}