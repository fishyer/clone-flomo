import unittest
import json
import tempfile
from pathlib import Path

from fastapi.testclient import TestClient

from app.database import Base, create_engine_for_url, create_session_factory, seed_default_memos
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

    def test_seed_imports_flomo_export_with_tags_and_source(self) -> None:
        export = {
            "counts": {"memos": 2, "tags": 2, "usedDayCount": 1},
            "memos": [
                {
                    "slug": "slug-a",
                    "content": "<p>#标签A 第一条<br>第二行</p>",
                    "tags": ["标签A"],
                    "source": "incoming_webhook",
                    "created_at": "2026-06-29 12:57:27",
                    "updated_at": "2026-06-29 12:57:26",
                },
                {
                    "slug": "slug-b",
                    "content": "",
                    "tags": [],
                    "source": "web",
                    "created_at": "2026-06-29 12:04:00",
                    "updated_at": "2026-06-29 12:04:00",
                },
            ],
        }

        with tempfile.TemporaryDirectory() as temp_dir:
            export_path = Path(temp_dir) / "flomo-export.json"
            export_path.write_text(json.dumps(export), encoding="utf-8")

            seed_default_memos(self.SessionLocal, export_path)

        response = self.client.get("/api/memos")
        self.assertEqual(response.status_code, 200)
        memos = response.json()
        self.assertEqual(len(memos), 2)
        self.assertEqual(memos[0]["slug"], "slug-a")
        self.assertEqual(memos[0]["created_at"], "2026-06-29T12:57:27")
        self.assertEqual(memos[0]["content"], "#标签A 第一条\n第二行")
        self.assertEqual(memos[0]["tags"], ["标签A"])
        self.assertEqual(memos[0]["channel"], "API")
        self.assertEqual(memos[1]["content"], "")

        stats_response = self.client.get("/api/stats")
        self.assertEqual(stats_response.status_code, 200)
        self.assertEqual(
            stats_response.json(),
            {"memo_count": 2, "tag_count": 2, "used_day_count": 1},
        )


if __name__ == "__main__":
    unittest.main()
