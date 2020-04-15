const db = localStorage

export class NewMessagesView {
    private iterations : HTMLElement[]
    private solution: string
    private iteration_id: number
    constructor({solution, params } : {solution:string, params: URLSearchParams}) {
        let items = document.querySelectorAll<HTMLElement>(".track-header .iterations > a, .track-header .iterations > div")
        // for some reason they are repeated twice in the HTML???
        this.iterations = Array.prototype.slice.call(items, 0, items.length/2)

        // save params
        this.solution = solution
        this.iteration_id = Number(params.get("iteration_idx")) || this.iterations.length
        // console.log(this.iterations)
        // console.log(this.currentCounts())
        this.render()
    }
    render() {
        let priorCount = this.priorCounts()
        let newCount = this.currentCounts()
        for (let i = 0; i < newCount.length; i++) {
            if (newCount[i] > priorCount[i]) {
                this.iterations[i].classList.add("newMessages")
            }
        }
        console.log(priorCount)
        console.log(newCount)
        this.markIterationRead(this.iteration_id);
    }
    markIterationRead(index: number) {
        index -= 1
        if (this.priorCounts()[index] == this.currentCounts()[index]) { return }

        let prior = this.priorCounts();
        prior[index] = this.currentCounts()[index];
        db.setItem(this.storageKey, JSON.stringify(prior))
    }
    get storageKey() {return `solutions/${this.solution}/msgs` }
    priorCounts() : number[] {
        let data = db.getItem(this.storageKey)
        if (!data) {
            db.setItem(this.storageKey, JSON.stringify(this.currentCounts()))
            return this.currentCounts();
        } else {
            let updated = false
            let prior = JSON.parse(data)
            while (prior.length < this.currentCounts().length) {
                prior.push(0)
                updated = true
            }
            if (updated)
                db.setItem(this.storageKey, JSON.stringify(prior))
            return prior
        }
    }
    currentCounts() : number[] {
        return this.iterations.map((el) => {
            let num = el.querySelector<HTMLElement>(".num-comments .num")
            return Number(num?.innerHTML || 0)
        })
    }
}