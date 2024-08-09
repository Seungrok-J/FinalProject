package mallapi.demo.util;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import java.net.URL;
import java.util.Date;

public class S3Util {
    private AmazonS3 s3client;

    public S3Util() {
        this.s3client = AmazonS3ClientBuilder.standard()
                         .withRegion("ap-northeast-2") // 지역 설정
                         .build();
    }

    public URL generatePresignedURL(String bucketName, String objectKey) {
        Date expiration = new Date();
        long expTimeMillis = expiration.getTime();
        expTimeMillis += 1000 * 60 * 60; // URL 유효 시간 설정 (예: 1시간)
        expiration.setTime(expTimeMillis);

        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest(bucketName, objectKey)
                        .withMethod(HttpMethod.GET)
                        .withExpiration(expiration);
        return s3client.generatePresignedUrl(generatePresignedUrlRequest);
    }
}