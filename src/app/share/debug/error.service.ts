
import {throwError as observableThrowError,  Observable ,  of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';




import { catchError, tap, map } from 'rxjs/operators';

@Injectable()
export class ErrorService {

    constructor() { }

    public httphandleError(err: HttpErrorResponse) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let errorMessage = '';
        if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }

        // these get commented out in prod
        console.error(errorMessage);
        return observableThrowError(errorMessage);
        // this gets uncommented in prod
        // Observable.of(false);
    }

    public handleError(error: Response): Observable<any> {
      // in a real world app, we may send the server to some remote logging infrastructure
      // instead of just logging it to the console
      console.error(error);
      return observableThrowError(error.json() || 'Server error');
  }

  // for writing values inside forms
  public writeRawValue(info) {
    console.log(info.getRawValue());
  }

  // for writing to console observables
  public writetoconsole(info) {
    console.log(info);
  }

}
