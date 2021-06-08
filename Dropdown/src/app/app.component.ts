import {
  Component,
  ElementRef,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private renderer: Renderer2) {}
  value: string = 'Select State';
  toggle: boolean;
  items = [
    { id: '1', value: 'Delhi' },
    { id: '2', value: 'UP' },
    { id: '3', value: 'Kerala' },
    { id: '4', value: 'Gujrat' },
    { id: '5', value: 'Assam' },
  ];

  /**
   * to track active item (for accessability)
   */
  activedescendentItem: string = null;
  /**
   * dropdown option (for accessability)
   */
  @ViewChildren('option') options: QueryList<ElementRef>;

  toggleDropdown() {
    this.toggle = !this.toggle;
  }
  setOption(val: any) {
    this.value = val.value;
  }

  //for accessability
  onKeydown($event: KeyboardEvent) {
    switch ($event.code) {
      case 'ArrowDown': //Down Arrow
        this.executeArrowDown($event);
        break;

      case 'ArrowUp': // Up Arrow
        this.executeUpArrow($event);
        break;

      case 'Space': // Spacebar
        this.selectOption();
        break;
      case 'Home': // HOME
        this.selectFirstOption($event);
        break;
      case 'End': // END
        this.selectLastOption($event);
        break;
      case 'Escape': // Escape
        this.toggleDropdown();
        break;
      default:
        return;
    }
  }

  /**
   * This method is primarily used to update the current active descendant element
   */
  updateCurrentActiveDescendant() {
    this.options.forEach((eleRef: ElementRef) => {
      if (eleRef.nativeElement.id === this.activedescendentItem) {
        this.renderer.setAttribute(
          eleRef.nativeElement,
          'data-activedesendent',
          'true'
        );
      } else {
        this.renderer.setAttribute(
          eleRef.nativeElement,
          'data-activedesendent',
          'false'
        );
      }
    });
  }
  //to update the option
  updateOption(eleRef: ElementRef, index: number, optionsarray: ElementRef[]) {
    this.renderer.setAttribute(
      eleRef.nativeElement,
      'data-activedesendent',
      'false'
    );
    this.renderer.setAttribute(
      optionsarray[index].nativeElement,
      'data-activedesendent',
      'true'
    );
    this.activedescendentItem = optionsarray[index].nativeElement.id;
    optionsarray[index].nativeElement.scrollIntoView();
  }

  /**
   * Function executes logic associated to keydown for ARROW Down. This will set the next option into focus
   * @param $event
   */
  executeArrowDown($event: KeyboardEvent) {
    $event.preventDefault();
    this.options.some(
      (eleRef: ElementRef, index: number, optionsarray: ElementRef[]) => {
        if (
          typeof this.activedescendentItem != 'undefined' &&
          this.activedescendentItem
        ) {
          if (eleRef.nativeElement.id === this.activedescendentItem) {
            index = index + 1 < optionsarray.length ? index + 1 : 0;
            this.updateOption(eleRef, index, optionsarray);
            if ($event.shiftKey) {
              this.updateSelectedOption(optionsarray[index]);
            }
            return true;
          }
        } else {
          if (index == 0) {
            this.updateOption(eleRef, index, optionsarray);
            if ($event.shiftKey) {
              this.updateSelectedOption(optionsarray[index]);
            }
            return true;
          }
        }
      }
    );
  }

  /**
   * Function executes logic associated to keydown for ARROW UP. This will set the previous option into focus
   * @param $event
   */
  executeUpArrow($event: KeyboardEvent) {
    $event.preventDefault();
    this.options.some(
      (eleRef: ElementRef, index: number, optionsarray: ElementRef[]) => {
        if (
          typeof this.activedescendentItem != 'undefined' &&
          this.activedescendentItem
        ) {
          if (eleRef.nativeElement.id === this.activedescendentItem) {
            index =
              index > 0 && index <= optionsarray.length
                ? index - 1
                : optionsarray.length - 1;
            this.updateOption(eleRef, index, optionsarray);
            optionsarray[index].nativeElement.scrollIntoView();
            if ($event.shiftKey) {
              this.updateSelectedOption(optionsarray[index]);
            }
            return true;
          }
        } else {
          if (index == 0) {
            this.updateOption(eleRef, index, optionsarray);
            optionsarray[index].nativeElement.scrollIntoView();
            if ($event.shiftKey) {
              this.updateSelectedOption(optionsarray[index]);
            }
            return true;
          }
        }
      }
    );
  }

  /**
   * Function executes logic associated to keydown of Spacebar. This will select the current active-descendent i.e., focused option
   * @param $event
   */
  selectOption() {
    if (
      typeof this.activedescendentItem != 'undefined' &&
      this.activedescendentItem
    ) {
      this.options.some(
        (eleRef: ElementRef, index: number, optionsarray: ElementRef[]) => {
          if (eleRef.nativeElement.id === this.activedescendentItem) {
            this.updateSelectedOption(eleRef);
            this.toggleDropdown();
            return true;
          }
        }
      );
    }
  }
  /**
   * Utility fuction which will update the state of the option's model i.e.,selected/unselected
   * @param eleRef
   */
  updateSelectedOption(eleRef: ElementRef) {
    let id = eleRef.nativeElement.getAttribute('data-item-id');
    this.items.some((item: any) => {
      if (item.id == id) {
        this.value = item.value;
        return true;
      }
    });
  }

  /**
   * updates the current active descendent scrolls the option into view
   * @param eleRef
   * @param index
   * @param optionsarray
   */
  setActiveAndScrollIntoView(
    eleRef: ElementRef,
    index: number,
    optionsarray: ElementRef[]
  ) {
    this.renderer.setAttribute(
      eleRef.nativeElement,
      'data-activedesendent',
      'false'
    );
    this.renderer.setAttribute(
      optionsarray[index].nativeElement,
      'data-activedesendent',
      'true'
    );
    this.activedescendentItem = optionsarray[index].nativeElement.id;
    optionsarray[index].nativeElement.scrollIntoView();
  }
  /**
   * Triggered when HOME key is pressed. This sets the first option into focus
   * @param $event
   */
  selectFirstOption($event: KeyboardEvent) {
    $event.preventDefault();
    let firstIndex = 0;
    this.options.some(
      (eleRef: ElementRef, index: number, optionsarray: ElementRef[]) => {
        if (
          typeof this.activedescendentItem != 'undefined' &&
          this.activedescendentItem
        ) {
          if (eleRef.nativeElement.id === this.activedescendentItem) {
            this.updateOption(eleRef, firstIndex, optionsarray);
            this.setActiveAndScrollIntoView(eleRef, firstIndex, optionsarray);
            return true;
          }
        } else {
          this.renderer.setAttribute(
            optionsarray[firstIndex].nativeElement,
            'data-activedesendent',
            'true'
          );
          this.activedescendentItem = optionsarray[firstIndex].nativeElement.id;
          optionsarray[firstIndex].nativeElement.scrollIntoView();
          return true;
        }
      }
    );
  }

  /**
   * Triggered when END key is pressed. This sets the first option into focus
   * @param $event
   */
  selectLastOption($event: KeyboardEvent) {
    $event.preventDefault();
    let lastIndex = this.options.length - 1;
    this.options.some(
      (eleRef: ElementRef, index: number, optionsarray: ElementRef[]) => {
        if (
          typeof this.activedescendentItem != 'undefined' &&
          this.activedescendentItem
        ) {
          if (eleRef.nativeElement.id === this.activedescendentItem) {
            this.updateOption(eleRef, lastIndex, optionsarray);
            this.setActiveAndScrollIntoView(eleRef, lastIndex, optionsarray);
            return true;
          }
        } else {
          this.renderer.setAttribute(
            optionsarray[lastIndex].nativeElement,
            'data-activedesendent',
            'true'
          );
          this.activedescendentItem = optionsarray[lastIndex].nativeElement.id;
          optionsarray[lastIndex].nativeElement.scrollIntoView();
          return true;
        }
      }
    );
  }
}
