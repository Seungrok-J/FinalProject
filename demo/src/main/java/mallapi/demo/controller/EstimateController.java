package mallapi.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import mallapi.demo.domain.Estimate;
import mallapi.demo.domain.User;
import mallapi.demo.repository.EstimateRepository;
import mallapi.demo.repository.UserRepository;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/estimates")
public class EstimateController {

    private static final Logger logger = LoggerFactory.getLogger(EstimateController.class);

    @Autowired
    private EstimateRepository estimateRepository;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createEstimate(@RequestParam("image") MultipartFile image,
            @RequestParam("width") double width,
            @RequestParam("height") double height,
            @RequestParam("depth") double depth,
            @AuthenticationPrincipal User user) throws IOException {

        // 이미지 파일을 임시 파일로 저장
        File tempFile = File.createTempFile("upload-", ".png", new File(System.getProperty("java.io.tmpdir")));
        image.transferTo(tempFile);

        // 파이썬 스크립트 실행
        String estimateResult = runPythonScript("Estimate/estimate1.py", tempFile.getAbsolutePath(), width, height,
                depth);

        // 임시 파일 삭제
        tempFile.delete();

        // 결과 파싱
        double estimatedValue = parseEstimateResult(estimateResult);

        // 로깅: estimateResult 내용 확인
        logger.info("Estimate result content: {}", estimateResult);

        // 결과 저장
        Estimate estimate = new Estimate();
        estimate.setUser(user);
        estimate.setEstimateResult(estimateResult);
        estimate.setEstimatedValue(estimatedValue);
        estimateRepository.save(estimate);

        //logger.info("Estimate created with value: {}", estimatedValue);
        return ResponseEntity.ok(estimate);
    }

    private String runPythonScript(String scriptPath, String imagePath, double width, double height, double depth) {
        try {
            // logger.info("Running Python script at: {}", scriptPath);
            // logger.info("Image path: {}", imagePath);
            // logger.info("Width: {}, Height: {}, Depth: {}", width, height, depth);

            ProcessBuilder pb = new ProcessBuilder("python", scriptPath, imagePath,
                    String.valueOf(width),
                    String.valueOf(height),
                    String.valueOf(depth));
            pb.redirectErrorStream(true);
            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String line;
            StringBuilder output = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("Python script exited with code " + exitCode);
            }

            return output.toString();
        } catch (IOException | InterruptedException e) {
            logger.error("Error running Python script: ", e);
            throw new RuntimeException("Error running Python script", e);
        }
    }

    private double parseEstimateResult(String result) {
        // 결과에서 value 추출
        String[] lines = result.split("\n");
        for (String line : lines) {
            if (line.startsWith("value:")) {
                return Double.parseDouble(line.split(":")[1].trim());
            }
        }
        logger.error("Unable to parse estimate result from: {}", result);
        throw new RuntimeException("Unable to parse estimate result");
    }

    @GetMapping("/{estimateIdx}")
    public ResponseEntity<?> getEstimate(@PathVariable("estimateIdx") Long estimateIdx) {
        Optional<Estimate> estimate = estimateRepository.findById(estimateIdx);
    
        if (!estimate.isPresent()) {
            return ResponseEntity.notFound().build();
        }
    
        return ResponseEntity.ok(estimate.get());
    }
}