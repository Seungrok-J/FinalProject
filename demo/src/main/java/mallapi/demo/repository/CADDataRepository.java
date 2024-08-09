package mallapi.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mallapi.demo.domain.CADData;

@Repository
public interface CADDataRepository extends JpaRepository<CADData, Long> {
    CADData findByFileIdx(String fileIdx);
}