package mallapi.demo.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import mallapi.demo.domain.Service;
import mallapi.demo.domain.User;
import mallapi.demo.domain.CADData;
import mallapi.demo.dto.ServiceDTO;
import mallapi.demo.dto.ServiceRegistrationRequest;
import mallapi.demo.repository.ServiceRepository;
import mallapi.demo.repository.UserRepository;
import mallapi.demo.repository.CADDataRepository;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CADDataRepository cadDataRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerService(@RequestBody ServiceRegistrationRequest request) {
        if (request == null || request.getUserNo() == null || request.getCadDataId() == null) {
            return ResponseEntity.badRequest().body("Missing required data for service registration.");
        }

        // 사용자와 CAD 데이터를 찾습니다.
        User user = userRepository.findById(request.getUserNo()).orElse(null);
        CADData cadData = cadDataRepository.findById(request.getCadDataId()).orElse(null);

        if (user == null || cadData == null) {
            return ResponseEntity.badRequest().body("Invalid user or CAD data ID.");
        }

        // 서비스 객체를 생성하고 저장합니다.
        Service newService = new Service(user, cadData, request.getFilePath(), request.getTitle(),
                request.getBudget(), request.getDetail(), request.getMaterials(), request.getCompany());
        serviceRepository.save(newService);

        return ResponseEntity.ok().body("Service registered successfully");
    }

    // 사용자 ID에 따른 도면 정보를 조회
    @GetMapping("/by-user/{userNo}")
    public ResponseEntity<?> getServicesByUser(@PathVariable int userNo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Service> servicePage = serviceRepository.findByUserNo(userNo, pageable);

        if (servicePage.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("designs", servicePage.getContent().stream()
                .map(service -> new ServiceDTO(service.getServiceIdx(), service.getFilePath(), service.getTitle(),
                        service.getBudget(), service.getDetail(), service.getMaterials(), service.getCompany()))
                .collect(Collectors.toList()));
        response.put("totalPages", servicePage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    // 서비스 항목을 삭제하는 엔드포인트
    @DeleteMapping("/by-user/{userNo}/{serviceIdx}")
    public ResponseEntity<?> deleteService(@PathVariable int userNo, @PathVariable Long serviceIdx) {
        Optional<Service> serviceOptional = serviceRepository.findById(serviceIdx);
        if (!serviceOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
    
        Service service = serviceOptional.get();
        if (service.getUser().getNo() != userNo) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied to delete service");
        }
    
        serviceRepository.delete(service);
        return ResponseEntity.ok().body("Service deleted successfully");
    }

}