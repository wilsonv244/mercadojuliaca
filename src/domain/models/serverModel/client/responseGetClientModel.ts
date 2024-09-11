// interfaces/client.ts

export interface ClientEntity {
  id_client: number;
  document_number: string;
  last_name: string;
  first_name: string | null;
  phone_number: string | null;
  phone_number2: string | null;
  address: string | null;
  zone: string | null;
  province: string | null;
  district: string | null;
}

export interface ClientResponse {
  clients: ClientEntity[];
}
