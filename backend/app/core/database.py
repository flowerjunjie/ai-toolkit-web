
"""
数据库配置 - SQLite存储历史记录
"""

import sqlite3
from pathlib import Path
from datetime import datetime
from typing import List, Optional, Dict, Any


class HistoryDatabase:
    """历史记录数据库"""

    def __init__(self, db_path: str = "./history.db"):
        self.db_path = Path(db_path)
        self._init_database()

    def _get_connection(self):
        """获取数据库连接"""
        return sqlite3.connect(str(self.db_path))

    def _init_database(self):
        """初始化数据库表"""
        conn = self._get_connection()
        cursor = conn.cursor()

        # 创建历史记录表
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                module TEXT NOT NULL,
                command TEXT NOT NULL,
                params TEXT,
                success INTEGER,
                output TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # 创建收藏表
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS favorites (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                module TEXT NOT NULL,
                command TEXT NOT NULL,
                name TEXT,
                description TEXT,
                params TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)

        conn.commit()
        conn.close()

    def add_history(self, module: str, command: str, params: Dict[str, Any], 
                    success: bool, output: str) -&gt; int:
        """添加历史记录"""
        import json
        
        conn = self._get_connection()
        cursor = conn.cursor()

        timestamp = datetime.utcnow().isoformat()
        params_json = json.dumps(params) if params else None

        cursor.execute("""
            INSERT INTO history (timestamp, module, command, params, success, output)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (timestamp, module, command, params_json, 1 if success else 0, output))

        history_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return history_id

    def get_history(self, limit: int = 50, offset: int = 0, 
                    module: Optional[str] = None, 
                    command: Optional[str] = None) -&gt; List[Dict[str, Any]]:
        """获取历史记录"""
        import json
        
        conn = self._get_connection()
        cursor = conn.cursor()

        query = "SELECT id, timestamp, module, command, params, success, output, created_at FROM history"
        conditions = []
        params = []

        if module:
            conditions.append("module = ?")
            params.append(module)
        
        if command:
            conditions.append("command = ?")
            params.append(command)

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        cursor.execute(query, params)
        rows = cursor.fetchall()

        history = []
        for row in rows:
            history.append({
                "id": row[0],
                "timestamp": row[1],
                "module": row[2],
                "command": row[3],
                "params": json.loads(row[4]) if row[4] else {},
                "success": bool(row[5]),
                "output": row[6],
                "created_at": row[7],
            })

        conn.close()
        return history

    def delete_history(self, history_id: int) -&gt; bool:
        """删除历史记录"""
        conn = self._get_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM history WHERE id = ?", (history_id,))
        deleted = cursor.rowcount &gt; 0

        conn.commit()
        conn.close()

        return deleted

    def clear_history(self) -&gt; bool:
        """清空历史记录"""
        conn = self._get_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM history")
        cleared = cursor.rowcount &gt; 0

        conn.commit()
        conn.close()

        return cleared

    def add_favorite(self, module: str, command: str, name: Optional[str] = None,
                     description: Optional[str] = None, params: Optional[Dict[str, Any]] = None) -&gt; int:
        """添加收藏"""
        import json
        
        conn = self._get_connection()
        cursor = conn.cursor()

        params_json = json.dumps(params) if params else None

        cursor.execute("""
            INSERT INTO favorites (module, command, name, description, params)
            VALUES (?, ?, ?, ?, ?)
        """, (module, command, name, description, params_json))

        favorite_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return favorite_id

    def get_favorites(self, limit: int = 50, offset: int = 0) -&gt; List[Dict[str, Any]]:
        """获取收藏列表"""
        import json
        
        conn = self._get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, module, command, name, description, params, created_at
            FROM favorites ORDER BY created_at DESC LIMIT ? OFFSET ?
        """, (limit, offset))

        rows = cursor.fetchall()

        favorites = []
        for row in rows:
            favorites.append({
                "id": row[0],
                "module": row[1],
                "command": row[2],
                "name": row[3],
                "description": row[4],
                "params": json.loads(row[5]) if row[5] else {},
                "created_at": row[6],
            })

        conn.close()
        return favorites

    def delete_favorite(self, favorite_id: int) -&gt; bool:
        """删除收藏"""
        conn = self._get_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM favorites WHERE id = ?", (favorite_id,))
        deleted = cursor.rowcount &gt; 0

        conn.commit()
        conn.close()

        return deleted


# 全局数据库实例
db = HistoryDatabase()
