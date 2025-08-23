import { expect, describe, it, beforeEach, afterEach } from 'bun:test';
import { AddressTest, ContactTest, UserTest } from './test-util';
import app from '../src';

describe('POST /api/contacts/{id}/addresses', () => {
  beforeEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
    await UserTest.create();
    await ContactTest.create();
  });
  
  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should rejected if request is address not valid', async () => {
    const contact =  await ContactTest.get()
    const response = await app.request("/api/contacts/" + contact.id + '/addresses', {
      method: "post",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        country: '',
        postal_code: '',
      }),
    });

    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  })

  it('should rejected if contact is address not found', async () => {
    const contact =  await ContactTest.get()
    const response = await app.request("/api/contacts/" + (contact.id + 1) + '/addresses', {
      method: "post",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        country: 'Indonesia',
        postal_code: '21133',
      }),
    });

    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  })

  it('should success if request is valid', async () => {
    const contact =  await ContactTest.get()
    const response = await app.request("/api/contacts/" + contact.id + '/addresses', {
      method: "post",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        street: 'Jalan',
        city: 'Kota',
        province: 'Provinsi',
        country: 'Indonesia',
        postal_code: '21133',
      }),
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.id).toBeDefined();
    expect(body.data.street).toBe("Jalan");
    expect(body.data.city).toBe("Kota");
    expect(body.data.province).toBe("Provinsi");
    expect(body.data.country).toBe("Indonesia");
    expect(body.data.postal_code).toBe("21133");
  })
})

describe('GET /api/contacts/{id}/addresses/{addresses_id}', () => {
  beforeEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();

    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });
  
  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should rejected if address is not found', async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await app.request("/api/contacts/" + contact.id + '/addresses/' + (address.id + 1), {
      method: "get",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  })

  it('should success if address is exits', async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await app.request("/api/contacts/" + contact.id + '/addresses/' + address.id, {
      method: "get",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.id).toBeDefined();
    expect(body.data.street).toBe(address.street);
    expect(body.data.city).toBe(address.city);
    expect(body.data.province).toBe(address.province);
    expect(body.data.country).toBe(address.country);
    expect(body.data.postal_code).toBe(address.postal_code);
  })
})

describe('PUT /api/contacts/{id}/addresses/{addresses_id}', () => {
  beforeEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();

    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });
  
  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should rejected if request is invalid', async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await app.request("/api/contacts/" + contact.id + '/addresses/' + address.id, {
      method: "put",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        country: '',
        postal_code: ''
      })
    });

    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  })
  
  it('should rejected if request is not found', async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await app.request("/api/contacts/" + contact.id + '/addresses/' + (address.id + 1), {
      method: "put",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        country: 'Indonesia',
        postal_code: '21133'
      })
    });

    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  })

  it('should success if request is valid', async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await app.request("/api/contacts/" + contact.id + '/addresses/' + address.id, {
      method: "put",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        street: 'A',
        city: 'B',
        province: 'CF',
        country: 'Malaysia',
        postal_code: '11223'
      })
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.id).toBe(address.id);
    expect(body.data.street).toBe('A');
    expect(body.data.city).toBe('B');
    expect(body.data.province).toBe('CF');
    expect(body.data.country).toBe('Malaysia');
    expect(body.data.postal_code).toBe('11223');
  })
})