import { Injectable } from '@angular/core';
// import { GoogleTranslationService } from 'ngx-google-translate-ui';
import * as CONSTANTS from 'src/app/app.constants';

@Injectable({
  providedIn: 'root',
})
export class TranslatorService {
  constructor() {}

  translateValue(query: any, languageCode: string) {
    const body = {
      q: query,
      target: languageCode,
    };
    // return this.googleService.getTranslations(CONSTANTS.API_KEY, body);
  }
}
