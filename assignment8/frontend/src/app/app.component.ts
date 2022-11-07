import { Component, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


// credit: https://stackoverflow.com/questions/40393703/rxjs-observable-angular-2-on-localstorage-change
@Injectable()
export class ReservationService {

  private storage: Storage;
  private subjects: Map<string, BehaviorSubject<any>>;
  private length: BehaviorSubject<any>;
  private keys: BehaviorSubject<any>;

  /**
   * Constructor with service injection
   * @param storage 
   */
  constructor() {
      this.storage = window.localStorage;
      this.subjects = new Map<string, BehaviorSubject<any>>();
      this.length = new BehaviorSubject<any>(this.storage.length);
      this.keys = new BehaviorSubject<any>(this.storage.length);
  }

  /**
  * watch data of given key
  * @param key  
  */
  watch(key: string): Observable<any> {
      if (!this.subjects.has(key)) {
          this.subjects.set(key, new BehaviorSubject<any>(null));
      }
      var item:any = this.storage.getItem(key);
      if (item == null) {
          item = undefined;
      } else {
          item = JSON.parse(item);
      }
      this.subjects.get(key)!.next(item);
      return this.subjects.get(key)!.asObservable();
  }

  /**
   * get data of given key
   * @param key 
   */
  get(key: string): any {
      var item:any = this.storage.getItem(key);
      if (item == null) {
          item = undefined;
      } else {
          item = JSON.parse(item);
      }
      return item;
  }

  /**
   * set value on given key
   * @param key 
   * @param value 
   */
  set(key: string, value: any) {
      alert("Reservation created!");
      this.storage.setItem(key, JSON.stringify(value));
      this.length.next(this.storage.length);
      if (!this.subjects.has(key)) {
          this.subjects.set(key, new BehaviorSubject<any>(value));
      } else {
          this.subjects.get(key)!.next(value);
      }
      this.get_keys();
  }

  /**
  * remove given key
  * @param key 
  */
  remove(key: string) {
    alert('Reservation cancelled');
    if (this.subjects.has(key)) {
          this.subjects.get(key)!.complete();
          this.subjects.delete(key);
      }
      this.storage.removeItem(key);
      this.length.next(this.storage.length);
      this.get_keys();
  }

  /**
   * clear all available keys
   */
  clear() {
      this.subjects.clear();
      this.storage.clear();
      this.length.next(0);
  }

  get_length() {
    return this.length.asObservable();
  }

  get_keys() {
    let items = [];
    for (let i = 0; i < this.storage.length; i++) {
      items.push(this.storage.key(i))
    }
    this.keys.next(items);
    return this.keys.asObservable();
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ReservationService]
})
export class AppComponent {
  title = 'Buisness';
}
