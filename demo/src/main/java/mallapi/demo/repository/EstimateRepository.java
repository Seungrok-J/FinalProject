package mallapi.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import mallapi.demo.domain.Estimate;

public interface EstimateRepository extends JpaRepository<Estimate, Long> {
}
