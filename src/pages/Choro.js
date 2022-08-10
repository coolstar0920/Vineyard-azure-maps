import React, { useEffect, useMemo, useState } from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

import { useLeaflet } from "react-leaflet";
import L from "leaflet";
import "leaflet-choropleth";

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'date', headerName: 'Date', width: 130 },
    { field: 'measure', headerName: 'Measure', width: 200 },
    {
        field: 'note',
        headerName: 'Note',
        width: 150,
    },
    {
        field: 'image',
        headerName: 'Image',
        sortable: false,
        width: 160,
        valueGetter: (params) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    }
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialog-paper': {
        maxWidth: '100%'
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiBackdrop-root': {
        background: 'transparent'
    }
}));

const Choro = (props) => {
    const { map } = useLeaflet();
    const [choropleth, setChoropleth] = useState(null)
    const [open, setOpen] = useState(false);
    const { search, geojson } = props;

    const blocks = useMemo(() => {
        if (!geojson) return [];
        const sort = geojson.features.filter(item => search.indexOf(item.properties.id) != -1)
    }, [search, geojson])

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const BootstrapDialogTitle = (props) => {
        const { children, onClose, ...other } = props;

        return (
            <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
                {children}
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>
        );
    };

    useEffect(() => {
        if (Object.keys(geojson).length > 0) {
            if (choropleth) choropleth.clearLayers();

            const _chorop = L.choropleth(geojson, {
                valueProperty: "DIFF",
                scale: ["black", "red"],
                steps: 5,
                mode: "q",
                style: function (feature) { // Style option
                    if (search.indexOf(feature.properties.id) != -1) {
                        return {
                            'weight': 1.5,
                            'color': 'red',
                            'fillColor': 'blue',
                            'fillOpacity': 0.4
                        }
                    } else {
                        return {
                            'weight': 1,
                            'color': 'black',
                            'fillColor': 'green',
                            'fillOpacity': 0.3
                        }
                    }
                },
                onEachFeature: function (feature, layer) {
                    const handleClick = () => {
                        handleClickOpen()
                    }

                    if (search.indexOf(feature.properties.id) != -1) {
                        layer.on({
                            // mouseover: func,
                            // mouseout: func,
                            click: handleClick
                        });
                    } else {
                        layer.bindPopup(
                            `<div>` +
                            `<img src="${require(`../assets/img/${feature.properties.img}`).default}" width="250" height="160">` +
                            `<div class="contents">` +
                            `<h2>${feature.properties.name}</h2>` +
                            `<p>TOTAL : ${feature.properties.TOTAL}km<sup>2</sup></p>` +
                            `</div>` +
                            `</div>`
                        );
                    }

                }
            }).addTo(map);
            setChoropleth(_chorop);
        }
    }, [geojson, search]);

    return (
        <BootstrapDialog
            onClose={handleClose}
            open={open}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Crop Measure Instances
            </BootstrapDialogTitle>
            <DialogContent dividers>
                <Stack
                    sx={{
                        height: 375,
                        width: 780,
                        '& .MuiDataGrid-cell': {
                            '&:focus': {
                                outline: 'none'
                            }
                        },
                        '& .MuiDataGrid-columnHeader': {
                            '&:focus': {
                                outline: 'none !important'
                            }
                        }
                    }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableColumnMenu
                        disableSelectionOnClick
                        disableColumnSelector
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Save changes
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}

export default Choro;
