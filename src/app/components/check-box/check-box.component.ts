import { NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Checkbox } from 'primeng/checkbox';
import { ToggleSwitch } from 'primeng/toggleswitch';

/**
 * Toggle mode: omit `initValue` and drive state only via `control` (e.g. reactive forms + patchValue).
 * Or pass `initValue` to mirror into `control` (e.g. `[initValue]` from *ngFor without patching parent form).
 */
@Component({
  selector: 'app-check-box',
  standalone: true,
  imports: [Checkbox, ReactiveFormsModule, ToggleSwitch, NgIf, TranslatePipe],
  templateUrl: './check-box.component.html',
  styleUrl: './check-box.component.scss',
})
export class CheckBoxComponent implements OnChanges {
  @Input() isToggle = false;
  @Input() label = '';
  @Input() disabled = false;
  @Input() readOnly = false;
  /** If set, copied into `control` (omit to avoid overwriting reactive `control` updates). */
  @Input() initValue?: boolean;
  @Input() control: any = new FormControl();
  @Output() toggleValue = new EventEmitter<boolean>();

  /** Matches PrimeNG ToggleSwitch (trueValue defaults to boolean `true`, not numeric 1). */
  private coerceBool(v: unknown): boolean {
    if (v === true || v === 1) return true;
    if (v === false || v === 0) return false;
    if (typeof v === 'string') {
      const s = v.trim().toLowerCase();
      if (s === '1' || s === 'true') return true;
      if (s === '0' || s === 'false') return false;
    }
    return Boolean(v);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isToggle || !this.control || !changes['initValue']) {
      return;
    }
    const raw = changes['initValue'].currentValue;
    if (raw === undefined) {
      return;
    }
    const c = this.control as FormControl<boolean | null>;
    c.setValue(this.coerceBool(raw), { emitEvent: false });
  }

  onToggleChange(ev: { checked: boolean }): void {
    this.toggleValue.emit(!!ev?.checked);
  }
}
