package licenta.retrievedata.repositories;

import licenta.retrievedata.entitites.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface DeviceRepository extends JpaRepository<Device,Long> {
    @Query("SELECT DISTINCT d.category FROM Device d")
    List<String> findDistinctDeviceTypes();


    List<Device> findByPriceBetween(double minPrice, double maxPrice);

    List<Device> findByCategoryAndPriceBetween(String category, double minPrice, double maxPrice);
}
