import React, { useEffect, useMemo, useState } from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

import { useLeaflet } from "react-leaflet";
import L from "leaflet";
import "leaflet-choropleth";
import AddMeasure from './AddMeasure';

const columns = [
    { field: 'date', headerName: 'Date', width: 130 },
    { field: 'measure', headerName: 'Measure', width: 220, },
    { field: 'value', headerName: 'Value', width: 80 },
    {
        field: 'note',
        headerName: 'Note',
        width: 175,
    },
    {
        field: 'image',
        headerName: 'Image',
        sortable: false,
        width: 170,
        renderCell: (params) => {
            return (
                <img src={require(`../assets/img/${params.row.img}`).default} width="150" height="100" />
            )
        }
    }
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
    const [block, setBlock] = useState({});
    const [open, setOpen] = useState(false);
    const [addDrawer, setAddDrawer] = useState(false);
    const { search, geojson } = props;
    const blockInfo = useMemo(() => {
        return block.data?.map((item, index) => ({ id: index, ...item }));
    }, [block])

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
                        setBlock(feature.properties)
                        handleClickOpen()
                    }

                    layer.on({
                        // mouseover: func,
                        // mouseout: func,
                        click: handleClick
                    });

                    // layer.bindPopup(
                    //     `<div>` +
                    //     `<img src="${require(`../assets/img/${feature.properties.img}`).default}" width="250" height="160">` +
                    //     `<div class="contents">` +
                    //     `<h2>${feature.properties.name}</h2>` +
                    //     `<p>TOTAL : ${feature.properties.TOTAL}km<sup>2</sup></p>` +
                    //     `</div>` +
                    //     `</div>`
                    // );

                }
            }).addTo(map);
            setChoropleth(_chorop);
        }
    }, [geojson, search]);

    return (
        <Stack>
            <BootstrapDialog
                onClose={handleClose}
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {block.name} - Crop Measure Instances
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Stack
                        sx={{
                            height: 400,
                            width: 780,
                            '& .MuiDataGrid-cell': {
                                '&:focus': {
                                    outline: 'none !important'
                                }
                            },
                            '& .MuiDataGrid-columnHeader': {
                                '&:focus': {
                                    outline: 'none !important'
                                }
                            }
                        }}>
                        <DataGrid
                            rows={blockInfo || []}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            rowHeight={100}
                            // checkboxSelection
                            disableColumnMenu
                            disableSelectionOnClick
                            disableColumnSelector
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ pr: '16px !important' }}>
                    <Button variant="contained" onClick={() => setAddDrawer(true)}>
                        Add Measure
                    </Button>
                </DialogActions>
            </BootstrapDialog>
            <AddMeasure state={addDrawer} onClose={() => setAddDrawer(false)} />
        </Stack>
    );
}

export default Choro;
