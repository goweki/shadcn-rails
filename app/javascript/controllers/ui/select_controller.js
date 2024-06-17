import { Controller } from "@hotwired/stimulus"
import { useClickOutside } from "https://ga.jspm.io/npm:stimulus-use@0.51.3/dist/index.js";


export default class UISelectController extends Controller {
  static targets = ["value", "menu", "wrapper"]
  static values = { value: String }

  connect() {
    useClickOutside(this);
    this.valueTarget.textContent = this.valueValue || this.valueTarget.textContent || "Select an option"
    this.selectedOption = null
  }

  clickOutside(event) {
    this.menuTarget.classList.add("hidden")
  }

  toggle() {
    this.menuTarget.classList.toggle("hidden")
    this.wrapperTarget.querySelector("button").focus()

    const optionList = this.menuTarget.children
    const currentValue = this.valueTarget.textContent
    let childElement = null

    if (!this.menuTarget.classList.contains("hidden")) {
      this.adjustScrollPosition()
    }

    Array.from(optionList).forEach(function(child){
      if(currentValue == child.textContent) {
        child.classList.add("bg-gray-200", "text-gray-900")
        childElement = child
      }
    })

    if(childElement) {
      this.selectedOption = childElement
      childElement.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'start' })
    }
  }

  adjustScrollPosition() {
    const menuHeight = this.menuTarget.offsetHeight
    const optionsHeight = this.menuTarget.scrollHeight
    if (optionsHeight > menuHeight) {
      this.menuTarget.style.maxHeight = `${menuHeight}px`
      this.menuTarget.style.overflowY = "scroll"
    } else {
      this.menuTarget.style.maxHeight = "auto"
      this.menuTarget.style.overflowY = "auto"
    }
  }

  select(event) {
    const option = event.target
    this.setSelectedOption(option)
    this.selectCurrentOption()
  }

  setValue(value) {
    this.valueValue = value
    this.valueTarget.textContent = value
  }

  key(event) {
    if(this.menuTarget.classList.contains("hidden")) return

    switch (event.key) {
      case "Escape":
        this.menuTarget.classList.add("hidden")
        break
      case "ArrowUp":
        this.selectPreviousOption(event)
        break
      case "ArrowDown":
        this.selectNextOption(event)
        break
      case "Enter":
        this.selectCurrentOption()
        break
    }
  }

  selectPreviousOption(event) {
    const selected = this.selectedOption //this.options.querySelector(".selected")
    const prevOption = selected ? selected.previousElementSibling : this.options.lastElementChild
    this.setSelectedOption(prevOption)
  }

  selectNextOption(event) {
    const selected = this.selectedOption //this.options.querySelector(".selected")
    const nextOption = selected ? selected.nextElementSibling : this.options.firstElementChild
    this.setSelectedOption(nextOption)
  }

  selectCurrentOption() {
    const selected = this.selectedOption
    if (selected) {
      this.valueTarget.textContent = selected.textContent
      this.menuTarget.classList.add("hidden")

      this.wrapperTarget.textContent = selected.getAttribute('value')
      this.wrapperTarget.dispatchEvent(new Event('change'))
    }
  }

  setSelectedOption(option) {
    if(!option) return

    // Reset the previously selected option
    if (this.selectedOption) {
      this.selectedOption.classList.remove("bg-gray-200", "text-gray-900")
    }

    // Set the new selected option
    option.classList.add("bg-gray-200", "text-gray-900")
    this.selectedOption = option
    option.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'start' })
  }
}


// <div data-controller="ui--select" data-ui--select-target="wrapper" data-action="keydown->ui--select#key click->ui--date-picker#clickOption change->ui--date-picker#monthSelect">
// <div class="relative">
//   <button data-action="ui--select#toggle" data-ui--date-picker-target="month" class="py-2 px-3 rounded-md flex items-center justify-between w-full text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
//     <span data-ui--select-target="value">${isoDate.getMonthName()}</span>
//     <svg class="w-4 h-4 mt-1 stroke-slate-400" fill="none"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
//   </button>
//   <div data-ui--select-target="menu" data-action="click->ui--select#select"
//     class="absolute z-10 bg-white rounded-md shadow-lg mt-2 w-30 py-1 hidden overflow-auto max-h-60">
//     ${this.monthOptions(+isoDate.mm)}
//   </div>
// </div>
// </div>