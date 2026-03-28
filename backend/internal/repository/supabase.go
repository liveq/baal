package repository

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

type SupabaseClient struct {
	baseURL    string
	serviceKey string
	client     *http.Client
}

func NewSupabaseClient() *SupabaseClient {
	return &SupabaseClient{
		baseURL:    os.Getenv("SUPABASE_URL"),
		serviceKey: os.Getenv("SUPABASE_SERVICE_KEY"),
		client:     &http.Client{Timeout: 30 * time.Second},
	}
}

func (s *SupabaseClient) IsConfigured() bool {
	return s.baseURL != "" && s.serviceKey != ""
}

func (s *SupabaseClient) request(method, path string, body any, result any) error {
	var bodyReader io.Reader
	if body != nil {
		b, err := json.Marshal(body)
		if err != nil {
			return err
		}
		bodyReader = bytes.NewReader(b)
	}

	req, err := http.NewRequest(method, s.baseURL+"/rest/v1/"+path, bodyReader)
	if err != nil {
		return err
	}

	req.Header.Set("apikey", s.serviceKey)
	req.Header.Set("Authorization", "Bearer "+s.serviceKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "return=representation")

	resp, err := s.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	if resp.StatusCode >= 400 {
		return fmt.Errorf("supabase error %d: %s", resp.StatusCode, string(data))
	}

	if result != nil {
		return json.Unmarshal(data, result)
	}
	return nil
}

func (s *SupabaseClient) Get(path string, result any) error {
	return s.request("GET", path, nil, result)
}

func (s *SupabaseClient) Post(path string, body any, result any) error {
	return s.request("POST", path, body, result)
}

func (s *SupabaseClient) Patch(path string, body any) error {
	return s.request("PATCH", path, body, nil)
}

// Count 정확한 행 수 반환 (Supabase HEAD + Prefer: count=exact)
func (s *SupabaseClient) Count(path string) (int, error) {
	req, err := http.NewRequest("HEAD", s.baseURL+"/rest/v1/"+path, nil)
	if err != nil {
		return 0, err
	}
	req.Header.Set("apikey", s.serviceKey)
	req.Header.Set("Authorization", "Bearer "+s.serviceKey)
	req.Header.Set("Prefer", "count=exact")

	resp, err := s.client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	// Content-Range: 0-0/1234 형식에서 total 추출
	cr := resp.Header.Get("Content-Range")
	if cr == "" {
		return 0, nil
	}
	// "0-0/1234" or "*/1234"
	parts := strings.Split(cr, "/")
	if len(parts) == 2 {
		n, _ := strconv.Atoi(parts[1])
		return n, nil
	}
	return 0, nil
}
