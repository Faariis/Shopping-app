import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { KupciService } from './kupci.services';

describe('KupciService', () => {
  let service: KupciService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [KupciService], 
    });

    service = TestBed.inject(KupciService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});