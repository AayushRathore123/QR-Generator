import { Directive , HostListener} from '@angular/core';

@Directive({
  selector: '[appDisableCutCopyPaste]'
})
export class DisableCutCopyPasteDirective {

  constructor() { }

  @HostListener('copy', ["$event"])
  blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('paste', ["$event"])
  blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event'])
  blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }

}
