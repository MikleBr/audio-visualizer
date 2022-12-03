
const defaultOptions = {
    max: 16,
    min: -16,
    step: 0.1,
    default: 0,
    label: null,
    onChange: null,
    onInput: null
}

class SliderInput {
    #point = null;
    #filled = null;

    constructor(options) {
        this.options = { ...defaultOptions, ...options };
        this.value = this.options.default
        this.element = this.#createElement()
        this.#addDragEvent()
    }

    #createElement() {
        const elementWrapper = document.createElement('div');
        elementWrapper.classList.add('slider-wrapper')

        const element = document.createElement('div');
        element.classList.add('slider')
        elementWrapper.append(element);
        if (this.options.label) {
            const label = document.createElement('label');
            label.classList.add('slider-label')
            label.innerHTML = this.options.label;
            elementWrapper.append(label)
        }


        this.#filled = document.createElement('div');
        this.#filled.classList.add('slider-filled');

        this.#point = document.createElement('div');
        this.#point.classList.add('slider-point');

        element.append(this.#filled);
        element.append(this.#point);


        return elementWrapper
    }

    #addDragEvent() {
        const min = this.options.min;
        const max = this.options.max;
        const defaultPercent = ((this.value - min) / (max - min)) * 100
        this.#filled.style.height = `${defaultPercent}%`
        this.#point.style.bottom = `calc(${defaultPercent}% - 10px)`


        this.element.addEventListener('mousedown', (e) => {
            const height = this.element.offsetHeight;

            const mouseMove = (e) => {
                const mouseYCoordinate = e.pageY - this.element.offsetTop;
                const realPercent = 100 - (mouseYCoordinate / height) * 100;
                const percent = realPercent < 0 ? 0 : realPercent > 100 ? 100 : realPercent
                this.value = min + Math.round((max - min) * percent / 100)
                this.#filled.style.height = `${percent}%`
                this.#point.style.bottom = `calc(${percent}% - 10px)`
                this.options.onInput(this.value)
            }

            document.addEventListener('mousemove', mouseMove);

            document.addEventListener('mouseup', (e) => {
                this.options.onChange && this.options.onChange(this.value)
                document.removeEventListener('mousemove', mouseMove);
            })
        })
    }
}



