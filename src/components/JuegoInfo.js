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

    return (
        <thead>
            <tr>
                <th className="font-weight-bold text-center">#{(index)}</th>
                <th className="font-weight-bold text-center">EQUIPO 1:</th>
                <td className="text-center">{info.eq1_puntos}</td>
                <th className="font-weight-bold text-center">EQUIPO 2:</th>
                <td className="text-center">{info.eq2_puntos}</td>
                <th>Jugador:</th>
                <td>{info.max_suerte.jugador}</td>
                <th>Suerte:</th>
                <td>{info.max_suerte.suerte}</td>
                <th>Jugador:</th>
                <td>{info.max_exp.jugador}</td>
                <th>Exp. Ganada:</th>
                <td>+{info.max_exp.exp}</td>
                <th>Hombres:</th>
                <td>{puntosXgenero("H")}</td>
                <th>Mujeres:</th>
                <td>{puntosXgenero("M")}</td>
            </tr>
        </thead>
    );
}
export { JuegoInfo };