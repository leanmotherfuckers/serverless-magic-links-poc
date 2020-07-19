import Auth from "@aws-amplify/auth";

export const config = {
    Auth: {
        region: "eu-west-1",
        userPoolId: "eu-west-1_3LDqyPz4q",
        userPoolWebClientId: "68qg02gufvv2m7jpphigkjui2o",
        authenticationFlowType: "CUSTOM_AUTH"
    }
};

Auth.configure(config);
