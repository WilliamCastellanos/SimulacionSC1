function JuegoInfo({ info, index }) {

    const puntosXgenero = (genero) => {
        let t1 = info.info_puntos.pje1.filter(j => j.genero === genero);
        let t2 = info.info_puntos.pje2.filter(j => j.genero === genero);

        let puntos1 = t1.reduce((sum, item) => sum + item.puntos, 0);
        let puntos2 = t2.reduce((sum, item) => sum + item.puntos, 0);
        return puntos1 + puntos2;
    }

    const ganador = () => {
        if (info.eq1_puntos > info.eq2_puntos) {
            return "EQUIPO 1";
        } else if (info.eq2_puntos > info.eq1_puntos) {
            return "EQUIPO 2";
        } else {
            return "SIN GANADOR";
        }
    }

    return (<table className="table mt-4">
        <thead>
            <tr>
                <th className="text-center" colSpan="4">Juego #{(index + 1)} - {ganador()}</th>
            </tr>
            <tr>
                <th className="font-weight-bold text-center">EQUIPO 1:</th>
                <th className="text-center">{info.eq1_puntos}</th>
                <th className="font-weight-bold text-center">EQUIPO 2:</th>
                <th className="text-center">{info.eq2_puntos}</th>
            </tr>
            <tr>
                <th colSpan="4" className="text-center">Jugador con más Suerte:</th>
            </tr>
            <tr>
                <th>Jugador:</th>
                <td colSpan="3">{info.max_suerte.jugador}</td>
            </tr>
            <tr>
                <th>Suerte:</th>
                <td colSpan="3">{info.max_suerte.suerte}</td>
            </tr>
            <tr>
                <th colSpan="4" className="text-center">Jugador con más experiencia ganada:</th>
            </tr>
            <tr>
                <th>Jugador:</th>
                <td colSpan="3">{info.max_exp.jugador}</td>
            </tr>
            <tr>
                <th>Experiencia Ganada:</th>
                <td colSpan="3">+{info.max_exp.exp}</td>
            </tr>
            <tr>
                <th colSpan="4" className="text-center">Rondas ganadas por género:</th>
            </tr>
            <tr>
                <th>Hombres:</th>
                <td colSpan="3">{puntosXgenero("H")}</td>
            </tr>
            <tr>
                <th>Mujeres:</th>
                <td colSpan="3">{puntosXgenero("M")}</td>
            </tr>
        </thead>
    </table>
    );
}
export { JuegoInfo };