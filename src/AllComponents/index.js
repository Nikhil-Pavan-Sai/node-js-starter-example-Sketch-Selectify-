import React, { useEffect, useState } from 'react';
import { Toolbar, Link } from '@material-ui/core';
import CustomDrawer from '../CustomDrawer';
import { makeStyles } from '@material-ui/core/styles';
import Config from '../Config';
import Loading from '../Loading';

const useStyles = makeStyles(theme => ({
    branch: {
        marginLeft: '25%'
    },
    loading: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginLeft: '25%',
        marginTop: '25%',
        width: '20%',
        height: '20%'
    },
    components: {
        textAlign: 'center',
    },
    image: {
        minHeight: '80px',
        minWidth: '80px',
        maxWidth: '1000px'
    },
    imageDistance: {
        marginTop: '5%'
    },
    componentText: {
        textAlign: 'left',
        color: 'rgb(51,71,91)',
        fontWeight: 400
    },
}));

export default function AllComponents(props) {

    const classes = useStyles();
    var [project, setProjects] = useState({});
    const [assets, setAssets] = useState([]);
    const [load, setLoad] = useState(false);
    const [pics, setPics] = useState({});
    const [drawerLoad, setDrawerLoad] = useState(false);
    const [componentUrls, setComponentUrls] = useState([]);
    var [temp, setTemp] = useState([]);

    async function filterAssets(helper) {
        setLoad(true);
        let names = [];
        const images = await fetch('https://mighty-journey-85745.herokuapp.com/images/' + helper);
        const image_response = await images.json();
        console.log(image_response.projectLayer);
        setProjects(image_response.projectLayer);
        let tempImgs = image_response.myMap;
        console.log(image_response);
        setPics(tempImgs);
        console.log(tempImgs);
        image_response.names.forEach(element => {
            names.push(element);
        });
        setComponentUrls(image_response.urls);
        setTemp(names);
        setLoad(false);
    }

    useEffect(() => {
        const getAllComponents = async () => {
            setDrawerLoad(true);
            const all = await fetch('https://mighty-journey-85745.herokuapp.com/');
            const layerNames = await fetch('https://mighty-journey-85745.herokuapp.com/layerNames');
            const layer_response = await layerNames.json();
            setAssets(layer_response);
            setDrawerLoad(false);
        }
        getAllComponents();
    }, []);

    function TODO() {
        return new Set(Array.from(assets).filter(x => x.toLowerCase().includes(props.searchTerm.toLowerCase())));
    }

    return (
        <div>
            <div className={classes.branch}>
                <CustomDrawer loadState={drawerLoad} assets={TODO()} searchTerm={props.searchTerm} filterAssets={(x) => filterAssets(x)} />
                <Toolbar />
                {load ? <div className={classes.loading}><Loading /></div> :
                    <div className={classes.components}>
                        {temp.length ?
                            temp.map((item, idx) => (
                                <div className={classes.imageDistance} key={idx}>
                                    {item.map((val, index) => (
                                        <div key={index}>
                                            <h3>{val.name.substring(val.name.lastIndexOf("/") + 1) + "----" + project[val.id]}</h3>
                                            <img className={classes.image} id={val.id} src={`data:image/png;base64,${pics[val.id]}`} alt="I'm working on it. Please be patient!" />
                                            <div><Link key={componentUrls[index]} href={componentUrls[index]}>
                                                Like me? Click here.
                                    </Link></div>
                                        </div>
                                    ))}
                                </div>
                            )) :
                            <div className={classes.componentText}>
                                <h2>What is a component?</h2>
                                <div style={{ marginBottom: '8%' }}>A UI element that can be used more than twice in the same way and can be broken down to its basics. It can have variants or variations (i.e. pagination with or without next arrows). It doesn’t usually have an opinion on content or task. For opinionated uses of components, see patterns.</div>
                                <h2>Are these all of the components?</h2>
                                <div style={{ marginBottom: '8%' }}>Nope. While just a fraction of the total system, we think it’s representative of the whole and a good introduction without losing the forest for the trees.</div>
                                <h2>Will these components change?</h2>
                                <div style={{ marginBottom: '8%' }}>Yup. These components are managed by a rotating group of designers and a dedicated team of front-end engineers working in partnership. This means that what designers create and what the engineers build is always up-to-date. Because designers pull from the same Sketch UI kit and because engineers pull from the same codebase, when these teams adjust or add components, those components are updated for everyone.</div>
                            </div>}
                    </div>}
            </div>
        </div>
    );
}