import {ThreeDots} from "react-loader-spinner";
import {Box} from "@mui/material";
import theme from "../theme";
import React from "react";

const DottedAnimation = () =>
    <Box display="flex" width='100%' justifyContent="center">
        <ThreeDots color={theme.palette.primary.main}/>
    </Box>

export {DottedAnimation};