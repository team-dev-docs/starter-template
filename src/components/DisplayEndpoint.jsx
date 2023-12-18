import { Badge } from "./ui/badge"
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";

const DisplayEndpoint = ({ endpoint, method }) => {
    let badgeColor;
    switch (method) {
        case "GET":
            badgeColor = "green";
            break;
        case "PUT":
            badgeColor = "blue";
            break;
        case "POST":
            badgeColor = "yellow";
            break;
        case "DELETE":
            badgeColor = "red";
            break;
        default:
            badgeColor = "gray";
            break;
    }

    return (
    <>
    <Alert className="mt-[2em] mb-[1em] font-bold api" disabled value={ `${method} ${endpoint}`}>
        <AlertTitle><Badge>{method}</Badge><span className="font-bold api pl-[1em]">{endpoint}</span></AlertTitle>
    </Alert>
    </>
    )
}

export default DisplayEndpoint;