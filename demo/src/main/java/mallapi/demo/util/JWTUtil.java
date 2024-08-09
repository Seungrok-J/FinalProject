package mallapi.demo.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.crypto.SecretKey;

@Log4j2
public class JWTUtil {

    private static final String SECRET_KEY = "1234567890123456789012345678901234567890";

    public static String generateToken(String userEmail, String userName, Integer no, int expirationInMinutes) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userEmail", userEmail);
        claims.put("userName", userName);
        claims.put("no", no);

        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * expirationInMinutes))
                .signWith(key)
                .compact();
    }

    public static Claims validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            //log.error("Token expired: {}", token, e);
            throw new RuntimeException("Token expired", e);
        } catch (MalformedJwtException e) {
            //log.error("Token malformed: {}", token, e);
            throw new RuntimeException("Token malformed", e);
        } catch (Exception e) {
            //log.error("Token validation error: {}", token, e);
            throw new RuntimeException("Token validation failed", e);
        }
    }
}