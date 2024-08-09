package mallapi.demo.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import mallapi.demo.domain.Service;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    // List<Service> findByUserNo(int userNo);
    Page<Service> findByUserNo(int userNo, Pageable pageable);
}