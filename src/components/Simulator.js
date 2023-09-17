import { useState } from "react";
import { GameTable } from "./GameTable";
import ReactPaginate from 'react-paginate';
import './pagination.css';
import React from 'react';
import { Utilities } from "./Utilities";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Constants } from './Constans';

function Simulator({ juegos }) {
    const utils = new Utilities();
    const [simulating, setSimulating] = useState(false);
    const [ending, setEnding] = useState(false);
    const [infoGame, setinfoGame] = useState([]);

    const [modal, setModal] = useState("");


    const createTeam = (prefix) => {
        let equipo = [];
        let name = 65;
        for (let i = 0; i < Constants.PLAYERS_PER_TEAM; i++) {
            name += i;
            equipo.push({
                nombre: `${prefix}-${String.fromCharCode(name)}`,
                genero: utils.selectGender(),
                resistencia: Math.trunc(utils.generateNormalNumber(Constants.AVERAGE_RESISTANCE, Constants.RESISTANCE_DEVIATION)),
                experiencia: Constants.EXPERIENCE,
                sum_exp: 0,
                penitencia: 5,
                suerte: 0,
                elecciones: 0,
                rondasGanadas: 0,
                puntos: 0
            });
        }
        return equipo;
    };

    const [team1] = useState(createTeam("T1"));
    const [team2] = useState(createTeam("T2"));

    //Generar Suerte
    // Paso 1: Asignar valores de suerte aleatorios a cada jugador del equipo
    // Paso 2: Encontrar al jugador con la suerte máxima
    // Paso 3: Actualizar las elecciones de cada jugador en el equipo
    // Paso 4: Devolver el índice del jugador con la suerte máxima
    const generateLuck = async (equipo) => {
        for (let i = 0; i < equipo.length; i++) {
            equipo[i].suerte = await utils.generateDecimalBetween(Constants.MINIMAL_LUCK, Constants.MAXIMAL_LUCK);
        }
        let index = 0;
        let max = 0;
        for (let i = 0; i < equipo.length; i++) {
            const j = equipo[i];
            if (max < j.suerte) {
                max = j.suerte;
                index = i;
            }
        }
        for (let i = 0; i < equipo.length; i++) {
            if (i === index) {
                equipo[index].elecciones += 1;
            } else {
                equipo[i].elecciones = 0;
            }
        }
        return index;
    }

    const throwTimes = (equipo, lanzador) => {
        let resAnterior = equipo[lanzador].resistencia;
        let puntos = 0;
        while (equipo[lanzador].resistencia >= equipo[lanzador].penitencia) {
            puntos += launch(equipo[lanzador].genero);
            equipo[lanzador].resistencia -= equipo[lanzador].penitencia
        }
        equipo[lanzador].resistencia = resAnterior - Math.trunc(utils.generateDecimalBetween(1, 2));
        return puntos;
    }

    const launch = (genero) => {
        let l = Math.random();
        const dianas = (genero === "M") ? Constants.TARGET_WOMEN : Constants.TARGET_MEN;
        let tiro = 0;
        for (let i = 0; i < dianas.length; i++) {
            if (l <= dianas[i]) {
                tiro = i;
                break;
            }
        }
        return Constants.TARGET_VALUES[tiro];
    }

    const validatePoints = (puntos1, puntos2, temp1, temp2, l1, l2) => {
        if (puntos1 === puntos2) {
            let a = puntos1;
            let b = puntos2;
            while (a === b) {
                a = launch(temp1[l1].genero)
                b = launch(temp2[l2].genero)
                if (a > b) {
                    temp1[l1].experiencia += 3;
                    temp1[l1].sum_exp += 3;
                    temp1[l1].rondasGanadas += 1;
                }
                if (b > a) {
                    temp2[l2].experiencia += 3
                    temp2[l2].sum_exp += 3
                    temp2[l2].rondasGanadas += 1
                }
            }
        } else if (puntos1 > puntos2) {
            temp1[l1].experiencia += 3;
            temp1[l1].sum_exp += 3;
            temp1[l1].rondasGanadas += 1;
        } else {
            temp2[l2].experiencia += 3;
            temp2[l2].sum_exp += 3;
            temp2[l2].rondasGanadas += 1
        }
        if (temp1[l1].sum_exp >= 9) {
            temp1[l1].penitencia = 1
        }
        if (temp2[l2].sum_exp >= 9) {
            temp2[l2].penitencia = 1
        }
    }

    const maxExperienceGame = (temp1, temp2) => {
        let me1 = temp1.sort((j1, j2) => j2.sum_exp - j1.sum_exp)[0];
        let me2 = temp2.sort((j1, j2) => j2.sum_exp - j1.sum_exp)[0];
        if (me1 > me2) {
            return {
                jugador: me1.nombre,
                exp: me1.sum_exp
            }
        } else {
            return {
                jugador: me2.nombre,
                exp: me2.sum_exp
            }
        }
    }

    const pointsXGamePlayer = (temp1, temp2) => {
        let pje1 = temp1.map(j => { return { jugador: j.nombre, genero: j.genero, puntos: j.puntos, rondas: j.rondasGanadas } })
        let pje2 = temp2.map(j => { return { jugador: j.nombre, genero: j.genero, puntos: j.puntos, rondas: j.rondasGanadas } })
        return { pje1, pje2 };
    }

    const start = async () => {
        setSimulating(true);
        let tempJI = [];
        for (let i = 0; i < juegos; i++) {
            let temp1 = team1.map(x => x);
            let temp2 = team2.map(x => x);
            let puntosE1 = 0;
            let puntosE2 = 0;
            let msInfo = {
                jugador: "",
                suerte: 0,
            }
            for (let j = 0; j < Constants.NUMBER_OF_ROUNDS; j++) {
                let l1 = await generateLuck(temp1);
                let l2 = await generateLuck(temp2);
                if (temp1[l1].suerte > msInfo.suerte) {
                    msInfo.jugador = temp1[l1].nombre;
                    msInfo.suerte = temp1[l1].suerte;
                }
                if (temp2[l2].suerte > msInfo.suerte) {
                    msInfo.jugador = temp2[l2].nombre;
                    msInfo.suerte = temp2[l2].suerte;
                }
                let puntos1 = await throwTimes(temp1, l1);
                let puntos2 = await throwTimes(temp2, l2);
                await validatePoints(puntos1, puntos2, temp1, temp2, l1, l2);
                if (temp1[l1].elecciones === 3) {
                    puntos1 += launch(temp1[l1].genero);
                    temp1[l1].elecciones = 0;
                }
                if (temp2[l2].elecciones === 3) {
                    puntos2 += launch(temp2[l2].genero);
                    temp2[l2].elecciones = 0;
                }
                temp1[l1].puntos = puntos1;
                temp2[l2].puntos = puntos2;

                puntosE1 += puntos1;
                puntosE2 += puntos2;
            }


            await tempJI.push({
                max_suerte: msInfo,
                max_exp: maxExperienceGame(temp1, temp2),
                eq1_puntos: puntosE1,
                eq2_puntos: puntosE2,
                info_puntos: pointsXGamePlayer(temp1, temp2)
            });
            puntosE1 = 0;
            puntosE2 = 0;
            msInfo = {
                jugador: "",
                suerte: 0,
            }
        }
        setEnding(true)
        setinfoGame(tempJI);
    }

    const closeModal = () => {
        setModal("");
    }

    const pointsPlayerXGame = (nombre) => {
        let temp = [];
        for (let i = 0; i < infoGame.length; i++) {
            const juego = infoGame[i];
            let puntos = 0;
            let temp1 = juego.info_puntos.pje1.filter(e => e.jugador === nombre);
            for (let i = 0; i < temp1.length; i++) {
                puntos += temp1[i].puntos;
            }
            let temp2 = juego.info_puntos.pje2.filter(e => e.jugador === nombre);
            for (let i = 0; i < temp2.length; i++) {
                puntos += temp2[i].puntos;
            }
            temp.push({ juego: (i + 1), puntos: puntos })
        }
        return temp;
    }
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(0);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedJuegos = infoGame.slice(startIndex, endIndex);
    return (
        <div className="mt-4">
            {!simulating && <div className="text-center">
                <h3>Número de juegos: {juegos}</h3><br />
                <button className="btn btn-success btn-lg" onClick={start}>Iniciar</button>

            </div>}
            {!!ending && <div className="row">
                <div className="col card mx-1">
                    <h5 className="text-center">Equipo 1:</h5>
                    <div >
                        {team1.map(j => (<p key={`E1-${j.nombre}`} className="d-flex justify-content-between"> <label> {j.nombre} | {(j.genero === "H") ? "Hombre" : "Mujer"}</label> <button className="btn btn-success btn-sm" onClick={e => setModal(j.nombre)}>Ver Grafico</button></p>))}
                    </div>
                </div>
                <div className="col card mx-1">
                    <h5 className="text-center ">Equipo 2:</h5>
                    <div >
                        {team2.map(j => (<p key={`E2-${j.nombre}`} className="d-flex justify-content-between"> <label> {j.nombre} | {(j.genero === "H") ? "Hombre" : "Mujer"}</label> <button className="btn btn-success btn-sm" onClick={e => setModal(j.nombre)}>Ver Grafico</button></p>))}
                    </div>
                </div>
            </div>}
            {
                !!ending && <div className=" rounded" >
                    <table className="table">
                        <tbody>
                            {displayedJuegos.map((j, i) => (
                                <GameTable key={`jueinfo-${i}`} info={j} index={((i + 1) - 5) + ((currentPage + 1) * 5)} />
                            ))}
                        </tbody>
                    </table>
                    <ReactPaginate
                        pageCount={Math.ceil(infoGame.length / itemsPerPage)}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={1}
                        onPageChange={handlePageChange}
                        previousLabel="Anterior"
                        nextLabel="Siguiente"
                        breakLabel="..."
                        containerClassName="pagination"
                        activeClassName="active"
                        pageClassName="page"
                        pageLinkClassName="page-link"
                        previousClassName="previous"
                        previousLinkClassName="previous-link"
                        nextClassName="next"
                        nextLinkClassName="next-link"
                    />
                </div>
            }
            {(modal !== "") && <Modal jugador={modal} getInfo={pointsPlayerXGame} cerrar={closeModal} />}
        </div>
    );
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Modal({ jugador, getInfo, cerrar }) {

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Puntos/Juego ${jugador}`,
            },
        },
    };

    const info = getInfo(jugador);
    console.log(info)
    const labels = info.map(e => e.juego);

    const puntos = info.map(e => e.puntos);

    const data = {
        labels,
        datasets: [
            {
                label: `Puntos/Juego ${jugador}`,
                data: puntos,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };

    return (<div style={
        { width: '100vw', padding: "10px", height: "100vh", zIndex: 3, position: 'fixed', backgroundColor: 'rgba(0,0,0,0.4)', left: 0, top: 0 }}>

        <div className='card' style={{ maxWidth: "70vw", margin: "auto" }}>
            <div className='card-header my-2 px-4'>
                <div className='row d-flex justify-content-center'>
                    <h3 className='col'>Puntos por juego de: {jugador}</h3>
                    <button className='col btn btn-outline-danger btn-sm' style={{ maxWidth: "30px" }} onClick={cerrar}>x</button>
                </div>
            </div>
            <div className='card-body' >
                <Line options={options} data={data} style={{ maxWidth: "100%", height: "auto" }} />;
            </div>
        </div>
    </div>);
}


export { Simulator };
