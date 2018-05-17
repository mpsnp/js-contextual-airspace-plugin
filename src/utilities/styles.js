import axios from 'axios';
import { find, findIndex, get, keyBy, sortBy, uniqBy } from 'lodash';

export default function fetchMapStyles(url) {
    return new Promise((resolve, reject) => {
        return axios
        .get(url)
        .then(res => {
            let backgroundIndex = findIndex(res.data.layers, layer => layer.id && layer.id.includes('background|'))
            let overlayIndex = findIndex(res.data.layers, layer => layer.id && layer.id.includes('overlay|'))
            const background = res.data.layers[backgroundIndex - 1].id
            const overlay = res.data.layers[overlayIndex - 1].id
            const classifiedLayers = res.data.layers.map((layer, index, array) => {
                if (layer.id && layer.id.includes('airmap') && layer.id.includes('background')) {
                        return {
                            ...layer,
                            before: background || layer.id
                        }
                    } else if (layer.id && layer.id.includes('airmap') && layer.id.includes('overlay')) {
                        return {
                            ...layer,
                            before: overlay || layer.id
                        }
                    } else {
                        return layer
                    }
            }).filter(layer => {
                return get(layer, 'id', null) && layer.id.includes('airmap')
            })
            const unclassifiedLayers = classifiedLayers.filter(layer => get(layer, 'id', null) && layer.id.includes('unclassified'))
            resolve({
                classifiedLayers,
                unclassifiedLayers
            })
        })
        .catch(err => {
            reject(err)
        })
    })
}