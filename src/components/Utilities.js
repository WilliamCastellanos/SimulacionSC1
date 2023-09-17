class Utilities {
    // Método para seleccionar género
    selectGender() {
        let g = ["M", "H"];
        return g[Math.floor(Math.random() * g.length)];
    }

    // Método para generar un número decimal entre un mínimo y un máximo
    generateDecimalBetween(minimo, maximo) {
        return parseFloat((Math.random() * (maximo - minimo) + minimo).toFixed(2));
    }

    // Método para generar un número normal
    generateNormalNumber(media, desviacionEstandar) {
        var u = 1 - Math.random();
        var v = 1 - Math.random();
        var z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
        return Math.abs(media + z * desviacionEstandar);
    }
}

export { Utilities };