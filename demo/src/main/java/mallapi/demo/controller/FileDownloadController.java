package mallapi.demo.controller;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FileDownloadController {

    @Autowired
    private AmazonS3 amazonS3;
    private String bucketName = "sfacsolution";

    @GetMapping("/files/{fileNumber}") // 경로 변수 이름 변경
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable String fileNumber) {
        try {
            // AmazonS3 클라이언트를 사용하여 S3에서 fileNumber를 이름으로 가진 파일을 검색
            S3Object s3Object = amazonS3.getObject(bucketName, fileNumber);
            S3ObjectInputStream inputStream = s3Object.getObjectContent();
            // 파일 스트림을 클라이언트에게 전달
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("application/octet-stream"))
                    .body(new InputStreamResource(inputStream));
        } catch (Exception e) {
            // 오류 처리: 내부 서버 오류 응답 반환
            return ResponseEntity.internalServerError().build();
        }
    }
}