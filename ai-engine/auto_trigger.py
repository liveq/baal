"""
자가개선 트리거 v3 — claude -p 백그라운드 방식
포커스 불필요, 백그라운드에서 코드 분석+수정
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import os
import time
import subprocess

REPORT_PATH = os.path.join(os.path.dirname(__file__), "self_improve_report.txt")
CONTEXT_PATH = os.path.join(os.path.dirname(__file__), "AUTO_IMPROVE_CONTEXT.md")
LOG_PATH = os.path.join(os.path.dirname(__file__), "auto_improve_log.txt")
ENGINE_DIR = os.path.dirname(__file__)

last_trigger_time = 0


def check_report():
    """보고서 확인 — 문제 있거나 40분마다 정기 점검"""
    global last_trigger_time

    if not os.path.exists(REPORT_PATH):
        return False

    with open(REPORT_PATH, "r", encoding="utf-8") as f:
        report = f.read()

    # 문제 있으면 즉시
    if "상태: 정상" not in report:
        return True

    # 정상이어도 40분마다 정기 점검
    if time.time() - last_trigger_time > 2400:
        last_trigger_time = time.time()
        return True

    return False


def run_claude_improve():
    """claude -p로 백그라운드 자가개선"""
    global last_trigger_time
    last_trigger_time = time.time()

    prompt = f"""당신은 BAAL 커뮤니티 AI 엔진 자가개선 담당입니다.

1. {CONTEXT_PATH} 파일을 읽고 프로젝트 구조와 규칙을 파악하세요.
2. {REPORT_PATH} 파일을 읽고 현재 문제를 확인하세요.
3. {LOG_PATH} 파일을 읽고 이전 변경 이력을 확인하세요.
4. 반복되는 패턴이 있으면 근본 원인을 분석하고 코드를 수정하세요.
5. 변경한 내용을 {LOG_PATH}에 기록하세요.
6. 문제 없으면 "조치 불필요"라고 로그에 기록하세요.

주의: 백엔드/프론트엔드 코드는 절대 수정하지 마세요. ai-engine 폴더 내 파이썬 파일만 수정 가능합니다."""

    try:
        print(f"[{time.strftime('%H:%M')}] claude -p 실행 중...")
        sys.stdout.flush()

        claude_path = os.path.expanduser("~/AppData/Roaming/npm/claude.cmd")
        result = subprocess.run(
            [claude_path, "-p", prompt, "--allowedTools", "Edit,Bash,Read,Write"],
            capture_output=True, text=True, timeout=300,
            cwd=ENGINE_DIR
        )

        output = result.stdout[:500] if result.stdout else "출력 없음"
        print(f"[{time.strftime('%H:%M')}] 완료: {output[:100]}")
        sys.stdout.flush()

    except subprocess.TimeoutExpired:
        print(f"[{time.strftime('%H:%M')}] 타임아웃 (5분)")
    except FileNotFoundError:
        print(f"[{time.strftime('%H:%M')}] claude CLI 없음 — 스킵")
    except Exception as e:
        print(f"[{time.strftime('%H:%M')}] 에러: {e}")

    sys.stdout.flush()


# === 비활성화됨 ===
# claude -p 세션이 파일 쓰기 권한 없이 무한 반복되는 문제로 비활성화.
# 자가개선은 self_improve.py가 직접 처리.
# 수동 실행: python auto_trigger.py --once
print("=== 자가개선 트리거 v3 — 비활성화됨 ===")
print("자가개선은 self_improve.py가 직접 처리합니다.")
sys.stdout.flush()

if __name__ == "__main__" and "--once" in sys.argv:
    run_claude_improve()
else:
    print("auto_trigger는 비활성화되었습니다. --once 플래그로 수동 실행 가능.")
    sys.stdout.flush()
