import unittest

from fastapi.testclient import TestClient

from app.database import Base, create_engine_for_url, create_session_factory
from app.main import create_app


class MemoApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = create_engine_for_url("sqlite:///:memory:")
        self.SessionLocal = create_session_factory(self.engine)
        Base.metadata.create_all(bind=self.engine)
        self.client = TestClient(create_app(self.SessionLocal, lambda: None))

    def tearDown(self) -> None:
        Base.metadata.drop_all(bind=self.engine)
        self.engine.dispose()

    def test_memo_crud_flow(self) -> None:
        create_response = self.client.post("/api/memos", json={"content": " 第一条备忘录 "})
        self.assertEqual(create_response.status_code, 201)
        created = create_response.json()
        self.assertEqual(created["content"], "第一条备忘录")

        list_response = self.client.get("/api/memos")
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(len(list_response.json()), 1)

        update_response = self.client.patch(
            f"/api/memos/{created['id']}",
            json={"content": "更新后的备忘录"},
        )
        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(update_response.json()["content"], "更新后的备忘录")

        replace_response = self.client.put(
            f"/api/memos/{created['id']}",
            json={"content": "PUT 更新后的备忘录"},
        )
        self.assertEqual(replace_response.status_code, 200)
        self.assertEqual(replace_response.json()["content"], "PUT 更新后的备忘录")

        get_response = self.client.get(f"/api/memos/{created['id']}")
        self.assertEqual(get_response.status_code, 200)
        self.assertEqual(get_response.json()["content"], "PUT 更新后的备忘录")

        delete_response = self.client.delete(f"/api/memos/{created['id']}")
        self.assertEqual(delete_response.status_code, 204)

        missing_response = self.client.get(f"/api/memos/{created['id']}")
        self.assertEqual(missing_response.status_code, 404)

    def test_rejects_blank_content(self) -> None:
        response = self.client.post("/api/memos", json={"content": "   "})
        self.assertEqual(response.status_code, 422)


if __name__ == "__main__":
    unittest.main()
