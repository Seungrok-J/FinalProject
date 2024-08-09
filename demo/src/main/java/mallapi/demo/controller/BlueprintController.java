package mallapi.demo.controller;

import java.util.Map; // 제네릭 맵을 위한 올바른 임포트
import java.util.HashMap; // HashMap도 사용 중이라면 임포트 추가
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.log4j.Log4j2;
import mallapi.demo.domain.BlueprintRequest;
import mallapi.demo.domain.CADData;
import mallapi.demo.repository.CADDataRepository;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@RestController
@RequestMapping("/api/blueprints")
public class BlueprintController {

    @Autowired
    private CADDataRepository cadDataRepository; // CAD 데이터에 접근하기 위한 Repository

    @PostMapping("/submit")
    public ResponseEntity<?> submitBlueprint(@RequestBody BlueprintRequest request) {
        try {
            String jsonOutput = runPythonScript(request);
            //log.info("Python script JSON output: " + jsonOutput); // Python 스크립트 출력 로그 추가
            List<CADData> cadDatas = extractCADDataFromJson(jsonOutput);
            if (!cadDatas.isEmpty()) {
                // Ensure all required data fields are properly sent to the client
                List<Map<String, Object>> responseData = cadDatas.stream().map(cadData -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", cadData.getId());
                    data.put("fileNumber", cadData.getFileNumber());
                    data.put("detail", cadData.getDetail());
                    data.put("title", cadData.getTitle());
                    data.put("materials", cadData.getMaterials());
                    data.put("budget", cadData.getBudget());
                    data.put("company", cadData.getCompany());
                    return data;
                }).collect(Collectors.toList());
                return ResponseEntity.ok().body(responseData);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No CAD data found based on the provided criteria.");
            }
        } catch (Exception e) {
            log.error("Error processing the blueprint submission: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal server error: " + e.getMessage());
        }
    }

    private String runPythonScript(BlueprintRequest request) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String jsonInput = mapper.writeValueAsString(request);

            // JSON 데이터를 파일로 저장
            File inputFile = File.createTempFile("blueprint_request", ".json");
            try (FileWriter writer = new FileWriter(inputFile)) {
                writer.write(jsonInput);
            }

            // SFAC4.py를 실행하도록 변경
            ProcessBuilder processBuilder = new ProcessBuilder("python", "SFAC4.py",
                request.getDetailed(), 
                String.join(",", request.getCompany()), 
                String.join(",", request.getMaterials()), 
                request.getDetails()
            );
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String output = reader.lines().collect(Collectors.joining("\n"));

            // 임시 파일 삭제
            inputFile.delete();
            return output; // JSON 형식으로 변환된 결과 반환
        } catch (Exception e) {
            throw new RuntimeException("Failed to run the python script: " + e.getMessage());
        }
    }

    private List<CADData> extractCADDataFromJson(String jsonOutput) {
        List<CADData> cadDataList = new ArrayList<>();
        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode rootNode = mapper.readTree(jsonOutput);
            JsonNode resultsNode = rootNode.path("results");
            for (JsonNode resultNode : resultsNode) {
                String fileIdx = resultNode.path("file_idx").asText(); // file_idx를 문자열로 처리
                String fileNumber = resultNode.path("file_number").asText(); // file_number도 추출
                CADData cadData = cadDataRepository.findByFileIdx(fileIdx);
                if (cadData != null) {
                    cadData.setFileNumber(fileNumber); // file_number 설정
                    cadDataList.add(cadData);
                } else {
                    log.warn("CADData not found for fileIdx: " + fileIdx); // 데이터베이스에서 데이터를 찾지 못한 경우 로그 추가
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JSON output: " + e.getMessage());
        }
        return cadDataList;
    }
}