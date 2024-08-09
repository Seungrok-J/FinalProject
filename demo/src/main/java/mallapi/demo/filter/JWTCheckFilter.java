package mallapi.demo.filter;

import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import mallapi.demo.dto.MemberDTO;
import mallapi.demo.util.JWTUtil;
import io.jsonwebtoken.Claims;

@Log4j2
public class JWTCheckFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        //log.debug("Request URI: " + path); // 디버그 로그 추가
        if ("/api/forge/oauth/token".equals(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Claims claims = JWTUtil.validateToken(token);
                if (claims == null) {
                    throw new RuntimeException("Token claims are null, token validation failed.");
                }
                String userEmail = claims.get("userEmail", String.class);
                String userName = claims.get("userName", String.class);
                Integer no = claims.get("no", Integer.class);

                MemberDTO memberDTO = new MemberDTO(userEmail, userName, no);
                memberDTO.setToken(token);

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        memberDTO, null, memberDTO.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                //log.error("JWT Token validation error: {}", e.getMessage());
                response.setContentType("application/json");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"Unauthorized: Invalid token\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}