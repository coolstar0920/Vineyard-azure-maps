import React from "react";
import InputBase from "@mui/material/InputBase";
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

export const CInput = styled((props) => (
    <InputBase {...props} />
))(() => ({
    height: 45,
    borderRadius: 6,
    border: '1px solid rgb(118, 118, 118)',
    padding: 12,
}))

export const CTextField = styled((props) => (
    <TextField {...props} size="small" />
))(() => ({
    // '& .MuiTextField-root': {
    //     height: 45,
    //     '& .MuiInputBase-root': {
    //         borderRadius: 6,
    //         border: '1px solid rgb(118, 118, 118)',
    //     }
    // },
    // '& label': {
    //     lineHeight: 1
    // },
    // "& input": {

    //     padding: 12,
    // }
}))