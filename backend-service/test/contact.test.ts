import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { ContactTest, UserTest } from "./test-util";
import app from "../src";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should rejected if token is not valid", async () => {
    const response = await app.request("/api/contacts", {
      method: "post",
      headers: {
        Authorization: "salah",
      },
      body: JSON.stringify({
        first_name: "",
      }),
    });

    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });

  it("should rejected if contact is invalid", async () => {
    const response = await app.request("/api/contacts", {
      method: "post",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "",
      }),
    });

    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });

  it("should success if contact is valid (only first_name)", async () => {
    const response = await app.request("/api/contacts", {
      method: "post",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "Syafwan",
      }),
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe("Syafwan");
    expect(body.data.last_name).toBeNull();
    expect(body.data.email).toBeNull();
    expect(body.data.phone).toBeNull();
  });

  it("should success if contact is valid (full data)", async () => {
    const response = await app.request("/api/contacts", {
      method: "post",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "Syafwan",
        last_name: "Chalik",
        email: "syafwan@gmail.com",
        phone: "23424234324",
      }),
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe("Syafwan");
    expect(body.data.last_name).toBe("Chalik");
    expect(body.data.email).toBe("syafwan@gmail.com");
    expect(body.data.phone).toBe("23424234324");
  });
});

describe('GET /api/contacts/{id}', () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should get 404 if contact is not found', async () => {
    const contact = await ContactTest.get();
    
    const response = await app.request("/api/contacts/" + (contact.id + 1) , {
      method: "get",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  })

  it('should success if contact is exits', async () => {
    const contact = await ContactTest.get();

    const response = await app.request("/api/contacts/" + contact.id, {
      method: "get",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe(contact.first_name);
    expect(body.data.last_name).toBe(contact.last_name);
    expect(body.data.email).toBe(contact.email);
    expect(body.data.phone).toBe(contact.phone);
  })
})

describe('PUT /api/contacts{id}', () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should rejected update contact if request is invalid', async () => {
    const contact = await ContactTest.get();
    
    const response = await app.request("/api/contacts/" + contact.id, {
      method: "put",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: ''
      })
    });

    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  })

  it('should rejectes update contact if id is not found', async () => {
    const contact = await ContactTest.get();
    
    const response = await app.request("/api/contacts/" + (contact.id + 1) , {
      method: "put",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: 'Syafwan'
      })
    });

    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  })

  it('should success update contact if request is valid', async () => {
    const contact = await ContactTest.get();
    
    const response = await app.request("/api/contacts/" + contact.id, {
      method: "put",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: 'Syafwan',
        last_name: 'Chalik',
        email: 'scpj@gmail.com',
        phone: '085262548523'
      })
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe('Syafwan')
    expect(body.data.last_name).toBe('Chalik')
    expect(body.data.email).toBe('scpj@gmail.com')
    expect(body.data.phone).toBe('085262548523')
  })
})

describe('DELETE /api/contacts{id}', () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should rejected if contact id is not found', async () => {
    const contact = await ContactTest.get();
    
    const response = await app.request("/api/contacts/" + (contact.id + 1) , {
      method: "delete",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  })

  it('should success if contact is exits', async () => {
    const contact = await ContactTest.get();
    
    const response = await app.request("/api/contacts/" + contact.id , {
      method: "delete",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBe(true);
  })
})

describe('GET /api/contacts', () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.createMany(25);
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should be able to search contact', async () => {
    const response = await app.request('/api/contacts', {
      method: 'get',
      headers: {
        'Authorization': 'test'
      }
    })

    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body.data.length).toBe(10)
    expect(body.paging.current_page).toBe(1)
    expect(body.paging.size).toBe(10)
    expect(body.paging.total_page).toBe(3)
  })

  it('should be able to search contact using name', async () => {
    let response = await app.request('/api/contacts?name=wan', {
      method: 'get',
      headers: {
        'Authorization': 'test'
      }
    })

    expect(response.status).toBe(200)

    let body = await response.json()
    expect(body.data.length).toBe(10)
    expect(body.paging.current_page).toBe(1)
    expect(body.paging.size).toBe(10)
    expect(body.paging.total_page).toBe(3)

    response = await app.request('/api/contacts?name=lik', {
      method: 'get',
      headers: {
        'Authorization': 'test'
      }
    })

    expect(response.status).toBe(200)

    body = await response.json()
    expect(body.data.length).toBe(10)
    expect(body.paging.current_page).toBe(1)
    expect(body.paging.size).toBe(10)
    expect(body.paging.total_page).toBe(3)
  })

  it('should be able to search contact using email', async () => {
    let response = await app.request('/api/contacts?email=test', {
      method: 'get',
      headers: {
        'Authorization': 'test'
      }
    })

    expect(response.status).toBe(200)

    let body = await response.json()
    expect(body.data.length).toBe(10)
    expect(body.paging.current_page).toBe(1)
    expect(body.paging.size).toBe(10)
    expect(body.paging.total_page).toBe(3)
  })

  it('should be able to search contact using phone', async () => {
    let response = await app.request('/api/contacts?phone=1234', {
      method: 'get',
      headers: {
        'Authorization': 'test'
      }
    })

    expect(response.status).toBe(200)

    let body = await response.json()
    expect(body.data.length).toBe(10)
    expect(body.paging.current_page).toBe(1)
    expect(body.paging.size).toBe(10)
    expect(body.paging.total_page).toBe(3)
  })

  it('should be able to search without result', async () => {
    let response = await app.request('/api/contacts?name=pj', {
      method: 'get',
      headers: {
        'Authorization': 'test'
      }
    })

    expect(response.status).toBe(200)

    let body = await response.json()
    expect(body.data.length).toBe(0)
    expect(body.paging.current_page).toBe(1)
    expect(body.paging.size).toBe(10)
    expect(body.paging.total_page).toBe(0)

    response = await app.request('/api/contacts?email=geda', {
      method: 'get',
      headers: {
        'Authorization': 'test'
      }
    })

    expect(response.status).toBe(200)

    body = await response.json()
    expect(body.data.length).toBe(0)
    expect(body.paging.current_page).toBe(1)
    expect(body.paging.size).toBe(10)
    expect(body.paging.total_page).toBe(0)

    response = await app.request('/api/contacts?phone=unknown', {
      method: 'get',
      headers: {
        'Authorization': 'test'
      }
    })

    expect(response.status).toBe(200)

    body = await response.json()
    expect(body.data.length).toBe(0)
    expect(body.paging.current_page).toBe(1)
    expect(body.paging.size).toBe(10)
    expect(body.paging.total_page).toBe(0)
  })

  it('should be able to search with paging', async () => {
    let response = await app.request('/api/contacts?size=5', {
      method: 'get',
      headers: {
        'Authorization': 'test'
      }
    })

    expect(response.status).toBe(200)

    let body = await response.json()
    expect(body.data.length).toBe(5)
    expect(body.paging.current_page).toBe(1)
    expect(body.paging.size).toBe(5)
    expect(body.paging.total_page).toBe(5)

    response = await app.request('/api/contacts?size=5&page=2', {
      method: 'get',
      headers: {
        'Authorization': 'test'
      }
    })

    expect(response.status).toBe(200)

    body = await response.json()
    expect(body.data.length).toBe(5)
    expect(body.paging.current_page).toBe(2)
    expect(body.paging.size).toBe(5)
    expect(body.paging.total_page).toBe(5)

    response = await app.request('/api/contacts?size=5&page=100', {
      method: 'get',
      headers: {
        'Authorization': 'test'
      }
    })

    expect(response.status).toBe(200)

    body = await response.json()
    expect(body.data.length).toBe(0)
    expect(body.paging.current_page).toBe(100)
    expect(body.paging.size).toBe(5)
    expect(body.paging.total_page).toBe(5)
  })
})