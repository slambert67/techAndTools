import { AllocatedFlight } from './AllocatedFlight';
import { Link } from './Links';
import { Resource } from './Resource';

export interface Gate {
  links: Link[];
  resource: Resource;
  flights?: AllocatedFlight[];
  headers?: Headers;
}
