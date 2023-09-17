function GameTable({ info, index }) {
    const pointsByGender = (genero) => {
        let t1 = info.info_puntos.pje1.filter(j => j.genero === genero);
        let t2 = info.info_puntos.pje2.filter(j => j.genero === genero);

        let puntos1 = t1.reduce((sum, item) => sum + item.puntos, 0);
        let puntos2 = t2.reduce((sum, item) => sum + item.puntos, 0);
        return puntos1 + puntos2;
    }
    return (
        <thead>
            <tr>
                <th >
                    <td colspan="5">
                        <th className="font-weight-bold text-center"><span style={{ fontStyle: 'italic', color: 'green' }}>Juego </span> #{(index)}</th>
                        <th className="font-weight-bold text-center">EQUIPO 1:</th>
                        <td className="text-center">{info.eq1_puntos}</td>
                        <th className="font-weight-bold text-center">EQUIPO 2:</th>
                        <td className="text-center">{info.eq2_puntos}</td>
                        <th><span style={{ fontStyle: 'italic', color: 'green' }}>Jugador con más Suerte: </span> Jugador: </th>
                        <td >{info.max_suerte.jugador}</td>
                        <th>Suerte:</th>
                        <td>{info.max_suerte.suerte}</td>
                        <th><span style={{ fontStyle: 'italic', color: 'green' }}> Jugador con más experiencia ganada: </span> Jugador:</th>
                        <td>{info.max_exp.jugador}</td>
                        <th>Exp. Ganada:</th>
                        <td>+{info.max_exp.exp}</td>
                        <th><span style={{ fontStyle: 'italic', color: 'green' }}> Rondas ganadas por género: </span>  Hombres:</th>
                        <td>{pointsByGender("H")}</td>
                        <th>Mujeres:</th>
                        <td>{pointsByGender("M")}</td>
                    </td></th>
            </tr>
        </thead>
    );


}
export { GameTable };