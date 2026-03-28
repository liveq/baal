"""
자가개선 트리거 — self_improve_report.txt에 문제 있으면
Claude Code CLI를 비대화식으로 실행해서 조치
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import os
import time
import subprocess

REPORT_PATH = os.path.join(os.path.dirname(__file__), "self_improve_report.txt")
LAST_ACTION_PATH = os.path.join(os.path.dirname(__file__), "last_auto_action.txt")

def check_and_trigger():
    """보고서 확인 → 문제 있으면 Claude CLI 실행"""
    if not os.path.exists(REPORT_PATH):
        return

    with open(REPORT_PATH, "r", encoding="utf-8") as f:
        report = f.read()

    # "상태: 정상"이면 조치 불필요
    if "상태: 정상" in report:
        return

    # 이미 최근에 조치했으면 스킵 (1시간 이내)
    if os.path.exists(LAST_ACTION_PATH):
        mtime = os.path.getmtime(LAST_ACTION_PATH)
        if time.time() - mtime < 3600:
            return

    print(f"[AUTO] 문제 감지 — Claude CLI 실행")
    sys.stdout.flush()

    try:
        # Claude Code CLI 비대화식 실행
        result = subprocess.run(
            ["claude", "-p", f"C:/aicode/agent_workspace/024_ai_baal/ai-engine/self_improve_report.txt 파일을 읽고, 문제가 있으면 조치해. BAAL 커뮤니티 프로젝트 경로는 C:/aicode/agent_workspace/024_ai_baal/"],
            capture_output=True, text=True, timeout=300,
            cwd="C:/aicode/agent_workspace/024_ai_baal"
        )
        print(f"[AUTO] 완료: {result.stdout[:200]}")

        # 조치 기록
        with open(LAST_ACTION_PATH, "w") as f:
            f.write(f"last action: {time.strftime('%Y-%m-%d %H:%M')}\n")

    except Exception as e:
        print(f"[AUTO] 실패: {e}")

    sys.stdout.flush()


if __name__ == "__main__":
    print("=== 자가개선 트리거 시작 ===")
    while True:
        check_and_trigger()
        time.sleep(1800)  # 30분마다
