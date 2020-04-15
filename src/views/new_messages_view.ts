const db = localStorage

import { BUS, EventType } from "../lib/events"

export class NewMessagesView {
    private iterations : HTMLElement[]
    private solution: string
    private iteration_id: number
    get storageKey() {return `solutions/${this.solution}/msgs` }
    constructor({solution, params } : {solution:string, params: URLSearchParams}) {
        // for some reason they are repeated twice in the HTML???
        document.querySelector(".small-iterations-nav")?.remove()

        let items = document.querySelectorAll<HTMLElement>(".track-header .iterations > a, .track-header .iterations > div")
        this.iterations = Array.prototype.slice.call(items)
        // console.log(this.iterations)

        // save params
        this.solution = solution
        this.iteration_id = Number(params.get("iteration_idx")) || this.iterations.length
        this.render()

        BUS.listen(EventType.newComment, () => {
            this.markIterationRead(this.iteration_id);
            this.iterations[this.iteration_id-1].classList.remove("newMessages")
        })
    }
    render() {
        let priorCount = this.priorCounts()
        let newCount = this.currentCounts()
        for (let i = 0; i < newCount.length; i++) {
            if (newCount[i] > priorCount[i]) {
                this.iterations[i].classList.add("newMessages")
            }
        }
        this.markIterationRead(this.iteration_id);
    }
    markIterationRead(index: number) {
        // internal storage is 0 based counting, iterations are 1 based counting
        index -= 1
        if (this.priorCounts()[index] == this.currentCounts()[index]) { return }

        let prior = this.priorCounts();
        prior[index] = this.currentCounts()[index];
        db.setItem(this.storageKey, JSON.stringify(prior))
    }
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
    currentThreadMessageCount() {
        return document.querySelectorAll(".discussion .post-body .post-header").length
    }
    currentCounts() : number[] {
        let counts = this.iterations.map((el) => {
            let num = el.querySelector<HTMLElement>(".num-comments .num")
            return Number(num?.innerHTML) || 0
        })
        // because the iteration numbers up top aren't updated automatically to
        // reflect the current message count TODO: should we just fix that also?
        counts[this.iteration_id-1] = this.currentThreadMessageCount()
        return counts;
    }
}