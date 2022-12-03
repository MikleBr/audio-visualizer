class Equalizer {
    constructor(frequencies) {
        this.frequencies = frequencies || [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
        this.filters = this.#createFilters();
    }



    #createFilter(frequency) {
        var filter = audioContext.createBiquadFilter();

        filter.type = 'peaking'; // тип фильтра
        filter.frequency.value = frequency; // частота
        filter.Q.value = 1; // Q-factor
        filter.gain.value = 0;

        return filter;
    };

    #createFilters() {
        const filters = this.frequencies.map(this.#createFilter);

        filters.reduce((acc, curr) => {
            acc.connect(curr);
            return curr;
        });

        return filters;
    };
}