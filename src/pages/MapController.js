import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AzureMapsContext } from 'react-azure-maps';
import Stack from '@mui/material/Stack';
import { layer, source } from 'azure-maps-control';
import MapComponent from './MapComponent';
import Detail from './Detail';

const dataSourceRef = new source.DataSource();
const layerRef = new layer.PolygonLayer(dataSourceRef);

const MapController = (props) => {
    const { geojson } = props;
    const { mapRef, isMapReady } = useContext(AzureMapsContext);
    const [open, setOpen] = useState(false);
    const [block, setBlock] = useState({});

    const blockInfo = useMemo(() => {
        return block.data?.map((item, index) => ({ id: index, ...item }));
    }, [block])

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (isMapReady && mapRef) {
            mapRef.sources.add(dataSourceRef);
            mapRef.layers.add(layerRef);
            if (geojson) {
                addRandomMarker(geojson);
            }
            mapRef.events.add('click', function (e) {
                if (e.shapes && e.shapes.length > 0) {
                    let properties = e.shapes[0].properties;
                    if (properties.id) {
                        properties.data = JSON.parse(properties.data);
                        setBlock(properties)
                        handleClickOpen()
                    }
                }
            });
        }
        return () => {
            dataSourceRef.clear();
        }
    }, [isMapReady, geojson]);

    const addRandomMarker = (geos) => {
        dataSourceRef.add(geos.features);
    };

    return (
        <Stack sx={{ width: '100%', height: '100%' }}>
            <MapComponent />
            <Detail open={open} data={blockInfo} close={handleClose} block={block} />
        </Stack>
    );
};

export default MapController;